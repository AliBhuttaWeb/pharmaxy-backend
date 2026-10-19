import { Injectable } from '@nestjs/common';
import { Prisma } from '@gen/prisma/client';

import { PrismaService } from '@/database/prisma/prisma.service';

@Injectable()
export class PosRepository {
    constructor(private readonly prisma: PrismaService) {}

    updateBranchProductBatchQuantity(id: string, quantity: number, tx?: Prisma.TransactionClient) {
        return this.prisma.getClient(tx).branchProductBatch.update({
            where: {
                id,
            },

            data: {
                quantity,
            },
        });
    }

    updateBranchProductQuantity(id: string, quantity: number, tx?: Prisma.TransactionClient) {
        return this.prisma.getClient(tx).branchProduct.update({
            where: {
                id,
            },

            data: {
                quantity,
            },
        });
    }
}
