import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import { Prisma, PurchaseOrderStatus } from '@prisma/client';

import { BranchesService } from '@/modules/branches/services/branches.service';
import { ProductsService } from '@/modules/products/services/products.service';
import { SuppliersService } from '@/modules/suppliers/services/suppliers.service';

import { MESSAGES } from '../constants';

import { CreatePurchaseOrderDto, PurchaseOrderQueryDto, UpdatePurchaseOrderDto } from '../dtos';

import { PurchaseOrdersRepository } from '../repositories/purchase-orders-repository';
import { calculatePurchaseOrderTotals } from '../helpers/purchase-order-calculation.helper';

@Injectable()
export class PurchaseOrdersService {
    constructor(
        private readonly purchaseOrdersRepository: PurchaseOrdersRepository,

        private readonly branchesService: BranchesService,

        private readonly suppliersService: SuppliersService,

        private readonly productsService: ProductsService,
    ) {}

    findMany(query: PurchaseOrderQueryDto) {
        return this.purchaseOrdersRepository.findMany(query);
    }

    async findById(id: string) {
        const purchaseOrder = await this.purchaseOrdersRepository.findById(id);

        if (!purchaseOrder) {
            throw new NotFoundException(MESSAGES.ERROR.NOT_FOUND);
        }

        return purchaseOrder;
    }

    async create(dto: CreatePurchaseOrderDto) {
        const branch = await this.branchesService.findById(dto.branch_id);

        await this.suppliersService.get(dto.supplier_id);

        const productIds = dto.items.map((item) => item.product_id);

        if (new Set(productIds).size !== productIds.length) {
            throw new ConflictException(MESSAGES.ERROR.ALREADY_EXISTS);
        }

        await Promise.all(productIds.map((productId) => this.productsService.findById(productId)));

        const purchaseOrderNumber = await this.generatePurchaseOrderNumber(dto.branch_id);

        const totals = calculatePurchaseOrderTotals(dto);

        const data: Prisma.PurchaseOrderCreateInput = {
            pharmacy: {
                connect: {
                    id: branch.pharmacy_id,
                },
            },

            branch: {
                connect: {
                    id: dto.branch_id,
                },
            },

            supplier: {
                connect: {
                    id: dto.supplier_id,
                },
            },

            purchase_order_number: purchaseOrderNumber,

            status: PurchaseOrderStatus.DRAFT,

            order_date: new Date(dto.order_date),

            expected_delivery_date: dto.expected_delivery_date
                ? new Date(dto.expected_delivery_date)
                : undefined,

            subtotal: totals.subtotal,

            discount_amount: totals.discountAmount,

            tax_amount: totals.taxAmount,

            shipping_amount: dto.shipping_amount ?? '0',

            other_charges: dto.other_charges ?? '0',

            grand_total: totals.grandTotal,

            supplier_notes: dto.supplier_notes,

            internal_notes: dto.internal_notes,

            items: {
                create: totals.items,
            },
        };

        await this.purchaseOrdersRepository.create(data);

        return {
            message: MESSAGES.SUCCESS.CREATED,
        };
    }

    async update(id: string, dto: UpdatePurchaseOrderDto) {
        const purchaseOrder = await this.findById(id);

        if (dto.supplier_id) {
            await this.suppliersService.get(dto.supplier_id);
        }

        const data: Prisma.PurchaseOrderUpdateInput = {
            ...(dto.supplier_id && {
                supplier: {
                    connect: {
                        id: dto.supplier_id,
                    },
                },
            }),

            ...(dto.order_date && {
                order_date: new Date(dto.order_date),
            }),

            ...(dto.expected_delivery_date && {
                expected_delivery_date: new Date(dto.expected_delivery_date),
            }),

            ...(dto.discount_amount !== undefined && {
                discount_amount: dto.discount_amount,
            }),

            ...(dto.tax_amount !== undefined && {
                tax_amount: dto.tax_amount,
            }),

            ...(dto.shipping_amount !== undefined && {
                shipping_amount: dto.shipping_amount,
            }),

            ...(dto.other_charges !== undefined && {
                other_charges: dto.other_charges,
            }),

            ...(dto.supplier_notes !== undefined && {
                supplier_notes: dto.supplier_notes,
            }),

            ...(dto.internal_notes !== undefined && {
                internal_notes: dto.internal_notes,
            }),
        };

        await this.purchaseOrdersRepository.update(purchaseOrder.id, data);

        return {
            message: MESSAGES.SUCCESS.UPDATED,
        };
    }

    async delete(id: string) {
        await this.findById(id);

        await this.purchaseOrdersRepository.delete(id);

        return {
            message: MESSAGES.SUCCESS.DELETED,
        };
    }

    private async generatePurchaseOrderNumber(branchId: string) {
        const latest = await this.purchaseOrdersRepository.findLatestPurchaseOrder(branchId);

        if (!latest) {
            return 'PO-000001';
        }

        const lastNumber = Number(latest.purchase_order_number.replace('PO-', '')) || 0;

        return `PO-${String(lastNumber + 1).padStart(6, '0')}`;
    }
}
