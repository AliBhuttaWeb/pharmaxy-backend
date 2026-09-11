import { Injectable } from '@nestjs/common';
import { BatchSourceType, Prisma } from '@gen/prisma/client';

import { PrismaService } from '@/database/prisma/prisma.service';
import { ReceiveStockDto } from '../dtos';

@Injectable()
export class ProductBatchesRepository {
    constructor(private readonly prisma: PrismaService) {}

    private readonly productBatchRelations: Prisma.ProductBatchInclude = {
        branch_product: true,
        purchase_order_item: true,
    };

    create(data: Prisma.ProductBatchUncheckedCreateInput, tx?: Prisma.TransactionClient) {
        return this.prisma.getClient(tx).productBatch.create({
            data,
            include: this.productBatchRelations,
        });
    }

    createBatch(branchProductId: string, data: ReceiveStockDto, tx?: Prisma.TransactionClient) {
        return this.prisma.getClient(tx).productBatch.create({
            data: {
                branch_product_id: branchProductId,
                batch_number: data.batch_number,
                manufacturing_date: data.manufacturing_date
                    ? new Date(data.manufacturing_date)
                    : undefined,
                expiry_date: data.expiry_date ? new Date(data.expiry_date) : undefined,
                purchase_price: data.purchase_price,
                mrp: data.mrp,
                quantity: data.quantity,
                source_type: BatchSourceType.PURCHASE_ORDER,
            },
        });
    }

    update(
        id: string,
        data: Prisma.ProductBatchUncheckedUpdateInput,
        tx?: Prisma.TransactionClient,
    ) {
        return this.prisma.getClient(tx).productBatch.update({
            where: {
                id,
            },
            data,
        });
    }

    findById(id: string, tx?: Prisma.TransactionClient) {
        return this.prisma.getClient(tx).productBatch.findUnique({
            where: {
                id,
            },
        });
    }

    findManyByBranchProduct(branchProductId: string, tx?: Prisma.TransactionClient) {
        return this.prisma.getClient(tx).productBatch.findMany({
            where: {
                branch_product_id: branchProductId,
                deleted_at: null,
            },

            orderBy: {
                expiry_date: 'asc',
            },
        });
    }

    async findMany(
        branchProductId: string,
        page?: number,
        limit?: number,
        tx?: Prisma.TransactionClient,
        is_deleted?: boolean,
    ) {
        const where: Prisma.ProductBatchWhereInput = {
            branch_product_id: branchProductId,
            ...(is_deleted !== undefined && {
                deleted_at: is_deleted ? { not: null } : null,
            }),
        };

        const isPaginated = page !== undefined && limit !== undefined;

        if (!isPaginated) {
            const records = await this.prisma.productBatch.findMany({
                where,
                orderBy: { expiry_date: 'asc' },
            });
            return { records };
        }

        const [records, total] = await this.prisma.$transaction([
            this.prisma.productBatch.findMany({
                where,
                orderBy: { expiry_date: 'asc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            this.prisma.productBatch.count({ where }),
        ]);

        return { records, total };
    }

    findByBranchProductAndBatch(
        branchProductId: string,
        batchNumber: string,
        tx?: Prisma.TransactionClient,
    ) {
        return this.prisma.getClient(tx).productBatch.findFirst({
            where: {
                branch_product_id: branchProductId,
                batch_number: batchNumber,
                deleted_at: null,
            },
        });
    }

    findByBranchProductAndBatchNumber(
        branchProductId: string,
        batchNumber: string,
        tx?: Prisma.TransactionClient,
    ) {
        return this.prisma.getClient(tx).productBatch.findFirst({
            where: {
                branch_product_id: branchProductId,
                batch_number: batchNumber,
                deleted_at: null,
            },
        });
    }

    updateQuantity(id: string, quantity: number, tx?: Prisma.TransactionClient) {
        return this.prisma.getClient(tx).productBatch.update({
            where: {
                id,
            },

            data: {
                quantity,
            },
        });
    }

    incrementQuantity(id: string, quantity: number, tx?: Prisma.TransactionClient) {
        return this.prisma.getClient(tx).productBatch.update({
            where: {
                id,
            },
            data: {
                quantity: {
                    increment: quantity,
                },
            },
        });
    }

    decrementQuantity(id: string, quantity: number, tx?: Prisma.TransactionClient) {
        return this.prisma.getClient(tx).productBatch.update({
            where: {
                id,
            },
            data: {
                quantity: {
                    decrement: quantity,
                },
            },
        });
    }

    findAvailableForSale(branchProductId: string, tx?: Prisma.TransactionClient) {
        return this.prisma.getClient(tx).productBatch.findMany({
            where: {
                branch_product_id: branchProductId,

                quantity: {
                    gt: 0,
                },

                deleted_at: null,
            },

            orderBy: [
                {
                    expiry_date: 'asc',
                },
                {
                    created_at: 'asc',
                },
            ],
        });
    }

    decreaseBatchQuantity(batchId: string, quantity: number, tx?: Prisma.TransactionClient) {
        return this.decrementQuantity(batchId, quantity, tx);
    }
}
