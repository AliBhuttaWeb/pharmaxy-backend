import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '@/database/prisma/prisma.service';

import { AuthenticatedUser } from '@/modules/auth/types';

import { BranchContextService } from '@/common/services/branch-context.service';

import { BranchProductsRepository } from '@/modules/branch-products/repositories/branch-products.repository';

import { CreateHoldOrderDto, HoldOrderQueryDto } from '../dtos';

import { HoldOrdersRepository } from '../repositories/hold-orders.repository';

import { MESSAGES } from '../constants';

import { generateHoldNumber } from '../helpers/generate-hold-number';
import { Prisma } from '@gen/prisma/client';
import { buildPaginationMeta } from '@/common/pagination';

type PreparedHoldItem = {
    branch_product_id: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
    notes?: string;
};

@Injectable()
export class HoldOrdersService {
    constructor(
        private readonly prisma: PrismaService,

        private readonly holdOrdersRepository: HoldOrdersRepository,

        private readonly branchProductsRepository: BranchProductsRepository,

        private readonly branchContextService: BranchContextService,
    ) {}

    async create(dto: CreateHoldOrderDto, user: AuthenticatedUser) {
        const { branchId, pharmacyId } = await this.branchContextService.get(user);

        return this.prisma.$transaction(async (tx) => {
            const preparedItems: PreparedHoldItem[] = [];

            let subtotal = 0;

            for (const item of dto.items) {
                const branchProduct = await this.branchProductsRepository.findById(
                    item.branch_product_id,
                    tx,
                );

                if (!branchProduct) {
                    throw new NotFoundException(MESSAGES.ERROR.NOT_FOUND);
                }

                if (branchProduct.branch_id !== branchId) {
                    throw new ConflictException(MESSAGES.ERROR.INVALID_BRANCH);
                }

                if (!branchProduct.is_active) {
                    throw new ConflictException(MESSAGES.ERROR.PRODUCT_INACTIVE);
                }

                const quantity = Number(item.quantity);

                const unitPrice = Number(branchProduct.selling_price);

                const lineSubtotal = quantity * unitPrice;

                subtotal += lineSubtotal;

                preparedItems.push({
                    branch_product_id: branchProduct.id,

                    quantity,

                    unit_price: unitPrice,

                    subtotal: lineSubtotal,

                    notes: item.notes,
                });
            }

            const latest = await this.holdOrdersRepository.findLatest(branchId, tx);

            const holdNumber = generateHoldNumber(latest?.hold_number);

            return this.holdOrdersRepository.create(
                {
                    pharmacy: {
                        connect: {
                            id: pharmacyId,
                        },
                    },

                    branch: {
                        connect: {
                            id: branchId,
                        },
                    },

                    cashier: {
                        connect: {
                            id: user.id,
                        },
                    },

                    ...(dto.customer_id && {
                        customer: {
                            connect: {
                                id: dto.customer_id,
                            },
                        },
                    }),

                    hold_number: holdNumber,

                    subtotal,

                    discount_amount: 0,

                    tax_amount: 0,

                    grand_total: subtotal,

                    notes: dto.notes,

                    items: {
                        create: preparedItems.map((item) => ({
                            branch_product: {
                                connect: {
                                    id: item.branch_product_id,
                                },
                            },

                            quantity: item.quantity,

                            unit_price: item.unit_price,

                            subtotal: item.subtotal,

                            notes: item.notes,
                        })),
                    },
                },
                tx,
            );
        });
    }

    async findMany(branchId: string, query: HoldOrderQueryDto) {
        const { limit, page } = query;
        const { records, total } = await this.holdOrdersRepository.findMany(branchId, query);
        if (!total || !page || !limit) return { records };
        const pagination = buildPaginationMeta({ currentPage: page, limit, totalRecords: total });
        return { records, pagination };
    }

    async findById(id: string) {
        const hold = await this.holdOrdersRepository.findById(id);

        if (!hold) {
            throw new NotFoundException(MESSAGES.ERROR.NOT_FOUND);
        }

        return hold;
    }

    async delete(id: string, tx?: Prisma.TransactionClient) {
        await this.findById(id);
        return this.holdOrdersRepository.delete(id, tx);
    }

    cancel(id: string) {
        return this.holdOrdersRepository.delete(id);
    }

    async resume(id: string) {
        const hold = await this.findById(id);

        if (hold.expires_at && hold.expires_at < new Date()) {
            throw new ConflictException(MESSAGES.ERROR.EXPIRED);
        }

        return {
            hold_order_id: hold.id,

            customer_id: hold.customer_id,

            notes: hold.notes,

            subtotal: hold.subtotal.toString(),

            discount_amount: hold.discount_amount.toString(),

            tax_amount: hold.tax_amount.toString(),

            grand_total: hold.grand_total.toString(),

            items: hold.items.map((item) => ({
                branch_product_id: item.branch_product_id,

                quantity: item.quantity.toString(),

                unit_price: item.unit_price.toString(),

                subtotal: item.subtotal.toString(),

                notes: item.notes,
            })),
        };
    }
}
