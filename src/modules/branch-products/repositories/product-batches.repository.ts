import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '@/database/prisma/prisma.service';

@Injectable()
export class ProductBatchesRepository {
    constructor(private readonly prisma: PrismaService) {}

    private getClient(tx?: Prisma.TransactionClient) {
        return tx ?? this.prisma;
    }

    create(data: Prisma.ProductBatchUncheckedCreateInput, tx?: Prisma.TransactionClient) {
        return this.getClient(tx).productBatch.create({
            data,
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
}
