import { Injectable } from '@nestjs/common';
import { Prisma } from '@gen/prisma/client';

import { PrismaService } from '@/database/prisma/prisma.service';

@Injectable()
export class ProductBatchesRepository {
    constructor(private readonly prisma: PrismaService) {}

    private getClient(tx?: Prisma.TransactionClient) {
        return tx ?? this.prisma;
    }

    private readonly productBatchRelations: Prisma.ProductBatchInclude = {
        branch_product: true,
        purchase_order_item: true,
    };

    create(data: Prisma.ProductBatchUncheckedCreateInput, tx?: Prisma.TransactionClient) {
        return this.getClient(tx).productBatch.create({
            data,
            include: this.productBatchRelations,
        });
    }

    update(
        id: string,
        data: Prisma.ProductBatchUncheckedUpdateInput,
        tx?: Prisma.TransactionClient,
    ) {
        return this.getClient(tx).productBatch.update({
            where: {
                id,
            },
            data,
        });
    }

    findById(id: string, tx?: Prisma.TransactionClient) {
        return this.getClient(tx).productBatch.findUnique({
            where: {
                id,
            },
        });
    }

    findManyByBranchProduct(branchProductId: string, tx?: Prisma.TransactionClient) {
        return this.getClient(tx).productBatch.findMany({
            where: {
                branch_product_id: branchProductId,
                deleted_at: null,
            },

            orderBy: {
                expiry_date: 'asc',
            },
        });
    }
    findByBranchProductAndBatch(
        branchProductId: string,
        batchNumber: string,
        tx?: Prisma.TransactionClient,
    ) {
        return this.getClient(tx).productBatch.findFirst({
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
        return this.getClient(tx).productBatch.findFirst({
            where: {
                branch_product_id: branchProductId,
                batch_number: batchNumber,
                deleted_at: null,
            },
        });
    }

    updateQuantity(id: string, quantity: number, tx?: Prisma.TransactionClient) {
        return this.getClient(tx).productBatch.update({
            where: {
                id,
            },

            data: {
                quantity,
            },
        });
    }

    findAvailableForSale(branchProductId: string, tx?: Prisma.TransactionClient) {
        return this.getClient(tx).productBatch.findMany({
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
        return this.getClient(tx).productBatch.update({
            where: {
                id: batchId,
            },

            data: {
                quantity: {
                    decrement: quantity,
                },
            },
        });
    }
}
