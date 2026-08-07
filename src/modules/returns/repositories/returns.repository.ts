import { Injectable } from '@nestjs/common';
import { Prisma } from '@gen/prisma/client';

import { PrismaService } from '@/database/prisma/prisma.service';

import { ReturnQueryDto } from '../dtos';

@Injectable()
export class ReturnsRepository {
    constructor(private readonly prisma: PrismaService) {}

    private readonly returnRelations: Prisma.ReturnInclude = {
        pharmacy: true,

        branch: true,

        customer: true,

        cashier: true,

        invoice: true,

        items: {
            include: {
                invoice_item: {
                    include: {
                        product: true,

                        branch_product: true,
                    },
                },
            },
        },
    };

    private getClient(tx?: Prisma.TransactionClient) {
        return tx ?? this.prisma;
    }

    private buildWhere(
        branchId: string,

        query: ReturnQueryDto,
    ): Prisma.ReturnWhereInput {
        const { invoice_id, customer_id, cashier_id } = query;

        return {
            branch_id: branchId,

            ...(invoice_id && {
                invoice_id,
            }),

            ...(customer_id && {
                customer_id,
            }),

            ...(cashier_id && {
                cashier_id,
            }),
        };
    }

    async findMany(
        branchId: string,

        query: ReturnQueryDto,
    ) {
        const { page, limit } = query;

        const where = this.buildWhere(branchId, query);

        const isPaginated = page !== undefined && limit !== undefined;

        if (!isPaginated) {
            return this.prisma.return.findMany({
                where,

                include: this.returnRelations,

                orderBy: {
                    created_at: 'desc',
                },
            });
        }

        const [records, total] = await this.prisma.$transaction([
            this.prisma.return.findMany({
                where,

                include: this.returnRelations,

                orderBy: {
                    created_at: 'desc',
                },

                skip: (page - 1) * limit,

                take: limit,
            }),

            this.prisma.return.count({
                where,
            }),
        ]);

        return {
            records,

            total,
        };
    }

    findById(
        id: string,

        tx?: Prisma.TransactionClient,
    ) {
        return this.getClient(tx).return.findUnique({
            where: {
                id,
            },

            include: this.returnRelations,
        });
    }

    findByIdForCancel(
        id: string,

        tx?: Prisma.TransactionClient,
    ) {
        return this.getClient(tx).return.findUnique({
            where: {
                id,
            },

            include: {
                items: true,
            },
        });
    }

    findLatestReturn(
        branchId: string,

        tx?: Prisma.TransactionClient,
    ) {
        return this.getClient(tx).return.findFirst({
            where: {
                branch_id: branchId,
            },

            orderBy: {
                created_at: 'desc',
            },

            select: {
                return_number: true,
            },
        });
    }

    findInvoiceForReturn(
        invoiceId: string,

        tx?: Prisma.TransactionClient,
    ) {
        return this.getClient(tx).invoice.findUnique({
            where: {
                id: invoiceId,
            },

            include: {
                customer: true,

                items: {
                    include: {
                        product: true,

                        branch_product: true,

                        return_items: true,
                    },
                },
            },
        });
    }

    findInvoiceItemBatches(
        invoiceItemId: string,

        tx?: Prisma.TransactionClient,
    ) {
        return this.getClient(tx).invoiceItemBatch.findMany({
            where: {
                invoice_item_id: invoiceItemId,
            },

            orderBy: {
                created_at: 'asc',
            },
        });
    }

    create(
        data: Prisma.ReturnCreateInput,

        tx?: Prisma.TransactionClient,
    ) {
        return this.getClient(tx).return.create({
            data,

            include: this.returnRelations,
        });
    }

    cancel(
        id: string,

        tx?: Prisma.TransactionClient,
    ) {
        return this.getClient(tx).return.update({
            where: {
                id,
            },

            data: {
                status: 'CANCELLED',
            },
        });
    }

    restoreBatchQuantity(batchId: string, quantity: number, tx?: Prisma.TransactionClient) {
        return this.getClient(tx).productBatch.update({
            where: {
                id: batchId,
            },

            data: {
                quantity: {
                    increment: quantity,
                },
            },
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
