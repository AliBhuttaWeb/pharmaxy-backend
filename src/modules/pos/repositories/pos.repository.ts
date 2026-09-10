import { Injectable } from '@nestjs/common';
import { Prisma } from '@gen/prisma/client';

import { PrismaService } from '@/database/prisma/prisma.service';

@Injectable()
export class PosRepository {
    constructor(private readonly prisma: PrismaService) {}

    findLatestInvoice(branchId: string, tx?: Prisma.TransactionClient) {
        return this.prisma.getClient(tx).invoice.findFirst({
            where: {
                branch_id: branchId,
                deleted_at: null,
            },

            orderBy: {
                created_at: 'desc',
            },

            select: {
                invoice_number: true,
            },
        });
    }

    createInvoice(data: Prisma.InvoiceCreateInput, tx?: Prisma.TransactionClient) {
        return this.prisma.getClient(tx).invoice.create({
            data,

            include: {
                items: {
                    include: {
                        batches: true,
                    },
                },

                payments: true,
            },
        });
    }

    updateProductBatchQuantity(id: string, quantity: number, tx?: Prisma.TransactionClient) {
        return this.prisma.getClient(tx).productBatch.update({
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
