import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '@/database/prisma/prisma.service';
import { AuthenticatedUser } from '@/modules/auth/types';

import { CustomersService } from '@/modules/customers/services/customers.service';
import { BranchProductsRepository } from '@/modules/branch-products/repositories/branch-products.repository';
import { ProductBatchesRepository } from '@/modules/branch-products/repositories/product-batches.repository';

import { CreatePosSaleDto } from '../dtos';

import { PosRepository } from '../repositories/pos.repository';

import { allocateStock } from '../helpers/allocate-stock';
import { generateInvoiceNumber } from '../helpers/generate-invoice-number';
import { MESSAGES as CUSTOMER_MESSAGES } from '@modules/customers/constants';
import { getActiveBranchId } from '@/common/helpers';
import { MESSAGES as PRODUCT_MESSAGES } from '@modules/products/constants';
import { MESSAGES as BRANCH_MESSAGES } from '@modules/branch-products/constants';
import { HoldOrdersService } from '@/modules/hold-orders/services/hold-orders.service';

type PreparedSaleItem = {
    branchProduct: any;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
    allocations: {
        product_batch_id: string;
        quantity: number;
    }[];
};

@Injectable()
export class PosService {
    constructor(
        private readonly prisma: PrismaService,

        private readonly posRepository: PosRepository,

        private readonly branchProductsRepository: BranchProductsRepository,

        private readonly productBatchesRepository: ProductBatchesRepository,

        private readonly customersService: CustomersService,

        private readonly holdOrdersService: HoldOrdersService,
    ) {}
    private async processSale(
        dto: CreatePosSaleDto,

        user: AuthenticatedUser,
    ) {
        const branchId = getActiveBranchId(user);
        return this.prisma.$transaction(async (tx) => {
            const preparedItems: PreparedSaleItem[] = [];

            let subtotal = 0;

            for (const item of dto.items) {
                const branchProduct = await this.branchProductsRepository.findById(
                    item.branch_product_id,
                    tx,
                );

                if (!branchProduct) {
                    throw new NotFoundException(PRODUCT_MESSAGES.ERROR.NOT_FOUND);
                }

                const quantity = Number(item.quantity);

                if (Number(branchProduct.quantity) < quantity) {
                    throw new ConflictException(PRODUCT_MESSAGES.ERROR.INSUFFIENT_STOCK);
                }

                const batches = await this.productBatchesRepository.findAvailableForSale(
                    branchProduct.id,
                    tx,
                );

                const allocations = allocateStock(
                    batches.map((batch) => ({
                        id: batch.id,
                        quantity: Number(batch.quantity),
                    })),

                    quantity,
                );

                const unitPrice = Number(branchProduct.selling_price);

                const lineTotal = unitPrice * quantity;

                subtotal += lineTotal;

                preparedItems.push({
                    branchProduct,

                    quantity,

                    unitPrice,

                    lineTotal,

                    allocations,
                });
            }

            const pharmacyId = preparedItems[0].branchProduct.branch.pharmacy_id;

            const customer = dto.customer_id
                ? await this.customersService.findById(dto.customer_id)
                : await this.customersService.getOrCreateWalkInCustomer(pharmacyId);

            if (!customer) {
                throw new NotFoundException(CUSTOMER_MESSAGES.ERROR.NOT_FOUND);
            }

            const latestInvoice = await this.posRepository.findLatestInvoice(branchId, tx);

            const invoiceNumber = generateInvoiceNumber(latestInvoice?.invoice_number);

            const invoice = await this.posRepository.createInvoice(
                {
                    invoice_number: invoiceNumber,

                    branch: {
                        connect: {
                            id: branchId,
                        },
                    },

                    pharmacy: {
                        connect: {
                            id: pharmacyId,
                        },
                    },

                    cashier: {
                        connect: {
                            id: user.id,
                        },
                    },

                    customer: {
                        connect: {
                            id: customer.id,
                        },
                    },

                    subtotal,
                    grand_total: subtotal,

                    items: {
                        create: preparedItems.map((item) => ({
                            product: {
                                connect: {
                                    id: item.branchProduct.product_id,
                                },
                            },

                            branch_product: {
                                connect: {
                                    id: item.branchProduct.id,
                                },
                            },

                            quantity: item.quantity,
                            unit_price: item.unitPrice,
                            line_total: item.lineTotal,

                            batches: {
                                create: item.allocations.map((allocation) => ({
                                    product_batch: {
                                        connect: {
                                            id: allocation.product_batch_id,
                                        },
                                    },

                                    quantity: allocation.quantity,
                                })),
                            },
                        })),
                    },

                    payments: {
                        create: dto.payments.map((payment) => ({
                            payment_method: {
                                connect: {
                                    id: payment.payment_method_id,
                                },
                            },
                            amount: payment.amount,
                            status: 'SUCCESS',
                            paid_at: new Date(),
                        })),
                    },
                },

                tx,
            );

            for (const item of preparedItems) {
                for (const allocation of item.allocations) {
                    const batch = await this.productBatchesRepository.findById(
                        allocation.product_batch_id,
                        tx,
                    );

                    if (!batch) {
                        throw new NotFoundException(BRANCH_MESSAGES.ERROR.BATCH_NOT_FOUND);
                    }

                    await this.productBatchesRepository.updateQuantity(
                        batch.id,
                        Number(batch.quantity) - allocation.quantity,
                        tx,
                    );
                }

                await this.branchProductsRepository.updateQuantity(
                    item.branchProduct.id,
                    Number(item.branchProduct.quantity) - item.quantity,
                    tx,
                );
            }

            if (dto.hold_order_id) {
                await this.holdOrdersService.delete(dto.hold_order_id, tx);
            }

            return invoice;
        });
    }

    async createSale(
        dto: CreatePosSaleDto,

        user: AuthenticatedUser,
    ) {
        if (!dto.customer_id) {
            throw new ConflictException(CUSTOMER_MESSAGES.ERROR.CUSTOMER_REQUIRED);
        }

        return this.processSale(dto, user);
    }

    async createQuickSale(
        dto: CreatePosSaleDto,

        user: AuthenticatedUser,
    ) {
        return this.createSale(
            {
                ...dto,

                customer_id: undefined,
            },

            user,
        );
    }
}
