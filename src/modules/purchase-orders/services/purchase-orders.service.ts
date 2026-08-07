import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import { BatchSourceType, Prisma, PurchaseOrderStatus } from '@gen/prisma/client';

import { BranchesService } from '@/modules/branches/services/branches.service';
import { ProductsService } from '@/modules/products/services/products.service';
import { SuppliersService } from '@/modules/suppliers/services/suppliers.service';

import { MESSAGES } from '../constants';

import {
    CreatePurchaseOrderDto,
    PurchaseOrderQueryDto,
    ReceivePurchaseOrderDto,
    UpdatePurchaseOrderDto,
} from '../dtos';

import { PurchaseOrdersRepository } from '../repositories/purchase-orders-repository';
import { calculatePurchaseOrderTotals } from '../helpers/purchase-order-calculation.helper';
import { AuthenticatedUser } from '@/modules/auth/types';
import { BranchProductsRepository } from '@/modules/branch-products/repositories/branch-products.repository';
import { ProductBatchesRepository } from '@/modules/branch-products/repositories/product-batches.repository';
import { PrismaService } from '@/database/prisma/prisma.service';

@Injectable()
export class PurchaseOrdersService {
    constructor(
        private readonly purchaseOrdersRepository: PurchaseOrdersRepository,

        private readonly branchesService: BranchesService,

        private readonly suppliersService: SuppliersService,

        private readonly productsService: ProductsService,

        private readonly branchProductsRepository: BranchProductsRepository,

        private readonly productBatchesRepository: ProductBatchesRepository,

        private readonly prisma: PrismaService,
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

    async approve(id: string, user: AuthenticatedUser) {
        const purchaseOrder = await this.findById(id);

        if (purchaseOrder.status === PurchaseOrderStatus.ACCEPTED) {
            throw new ConflictException(MESSAGES.ERROR.ALREADY_APPROVED);
        }

        if (purchaseOrder.status === PurchaseOrderStatus.CANCELLED) {
            throw new ConflictException(MESSAGES.ERROR.INVALID_STATUS_FOR_APPROVAL);
        }

        if (purchaseOrder.status === PurchaseOrderStatus.RECEIVED) {
            throw new ConflictException(MESSAGES.ERROR.ALREADY_RECEIVED);
        }

        await this.purchaseOrdersRepository.update(id, {
            status: PurchaseOrderStatus.ACCEPTED,
            supplier_response_at: new Date(),
            approved_by: user.id,
        });

        return {
            message: MESSAGES.SUCCESS.APPROVED,
        };
    }

    async cancel(id: string) {
        const purchaseOrder = await this.findById(id);

        if (purchaseOrder.status === PurchaseOrderStatus.CANCELLED) {
            throw new ConflictException(MESSAGES.ERROR.ALREADY_CANCELLED);
        }

        if (purchaseOrder.status === PurchaseOrderStatus.RECEIVED) {
            throw new ConflictException(MESSAGES.ERROR.ALREADY_RECEIVED);
        }

        await this.purchaseOrdersRepository.update(id, {
            status: PurchaseOrderStatus.CANCELLED,
        });

        return {
            message: MESSAGES.SUCCESS.CANCELLED,
        };
    }

    async receive(id: string, dto: ReceivePurchaseOrderDto, user: AuthenticatedUser) {
        return this.prisma.$transaction(async (tx) => {
            const purchaseOrder = await this.purchaseOrdersRepository.findById(id, tx);

            if (!purchaseOrder) {
                throw new NotFoundException(MESSAGES.ERROR.NOT_FOUND);
            }

            const invalidStatuses: PurchaseOrderStatus[] = [
                PurchaseOrderStatus.DRAFT,
                PurchaseOrderStatus.PENDING_SUPPLIER,
                PurchaseOrderStatus.REJECTED,
                PurchaseOrderStatus.CANCELLED,
                PurchaseOrderStatus.RECEIVED,
            ];

            if (invalidStatuses.includes(purchaseOrder.status)) {
                throw new ConflictException(MESSAGES.ERROR.INVALID_STATUS_FOR_RECEIVING);
            }

            for (const item of dto.items) {
                const purchaseOrderItem = purchaseOrder.items.find(
                    (poItem) => poItem.id === item.purchase_order_item_id,
                );

                if (!purchaseOrderItem) {
                    throw new NotFoundException(MESSAGES.ERROR.NOT_FOUND);
                }

                const receivedQuantity = item.batches.reduce(
                    (total, batch) => total + Number(batch.received_quantity),
                    0,
                );

                const remainingQuantity =
                    Number(purchaseOrderItem.ordered_quantity) -
                    Number(purchaseOrderItem.received_quantity);

                if (receivedQuantity > remainingQuantity) {
                    throw new ConflictException(MESSAGES.ERROR.RECEIVED_QUANTITY_EXCEEDED);
                }

                const branchProduct = await this.branchProductsRepository.findByBranchAndProduct(
                    purchaseOrder.branch_id,
                    purchaseOrderItem.product_id,
                    undefined,
                    tx,
                );

                if (!branchProduct) {
                    throw new NotFoundException(MESSAGES.ERROR.BRANCH_PRODUCT_NOT_FOUND);
                }

                for (const batch of item.batches) {
                    const existingBatch =
                        await this.productBatchesRepository.findByBranchProductAndBatchNumber(
                            branchProduct.id,
                            batch.batch_number,
                            tx,
                        );

                    if (existingBatch) {
                        throw new ConflictException(MESSAGES.ERROR.BATCH_ALREADY_EXISTS);
                    }

                    await this.productBatchesRepository.create(
                        {
                            branch_product_id: branchProduct.id,

                            batch_number: batch.batch_number,

                            manufacturing_date: batch.manufacturing_date
                                ? new Date(batch.manufacturing_date)
                                : undefined,

                            expiry_date: batch.expiry_date
                                ? new Date(batch.expiry_date)
                                : undefined,

                            purchase_price: batch.purchase_price,

                            mrp: batch.mrp,

                            quantity: Number(batch.received_quantity),

                            source_type: BatchSourceType.PURCHASE_ORDER,

                            purchase_order_item_id: purchaseOrderItem.id,
                        },
                        tx,
                    );
                }

                await this.branchProductsRepository.updateQuantity(
                    branchProduct.id,
                    branchProduct.quantity + receivedQuantity,
                    tx,
                );

                await this.purchaseOrdersRepository.updatePurchaseOrderItem(
                    purchaseOrderItem.id,
                    {
                        received_quantity:
                            Number(purchaseOrderItem.received_quantity) + receivedQuantity,
                    },
                    tx,
                );
            }

            const updatedPurchaseOrder = await this.purchaseOrdersRepository.findById(id, tx);

            if (!updatedPurchaseOrder) {
                throw new NotFoundException(MESSAGES.ERROR.NOT_FOUND);
            }

            const isFullyReceived = updatedPurchaseOrder.items.every(
                (item) => Number(item.received_quantity) >= Number(item.ordered_quantity),
            );

            await this.purchaseOrdersRepository.update(
                id,
                {
                    status: isFullyReceived
                        ? PurchaseOrderStatus.RECEIVED
                        : PurchaseOrderStatus.PARTIALLY_FULFILLED,

                    receiver_notes: dto.receiver_notes,

                    ...(isFullyReceived && {
                        received_at: new Date(),
                        received_by: user.id,
                    }),
                },
                tx,
            );

            return {
                message: MESSAGES.SUCCESS.RECEIVED,
            };
        });
    }
}
