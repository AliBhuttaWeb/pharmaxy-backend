import { Injectable } from '@nestjs/common';
import { Prisma } from '@gen/prisma/client';
import { PrismaService } from '@/database/prisma/prisma.service';

@Injectable()
export class InvoicesRepository {
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

    findById(id: string, tx?: Prisma.TransactionClient) {
        return this.prisma.getClient(tx).invoice.findFirst({
            where: {
                id,
                deleted_at: null,
            },
            include: {
                customer: true,
                branch: true,
                user: {
                    select: {
                        id: true,
                        first_name: true,
                        last_name: true,
                        email: true,
                    },
                },
                items: {
                    include: {
                        product: true,
                        branch_product: true,
                        batches: {
                            include: {
                                product_batch: true,
                            },
                        },
                    },
                },
                payments: {
                    include: {
                        pharmacy_payment_method: true,
                    },
                },
                returns: true,
            },
        });
    }

    findMany(
        where: Prisma.InvoiceWhereInput,
        pagination: { skip: number; take: number },
        orderBy?: Prisma.InvoiceOrderByWithRelationInput,
    ) {
        return this.prisma.invoice.findMany({
            where,
            skip: pagination.skip,
            take: pagination.take,
            orderBy: orderBy || { created_at: 'desc' },
            include: {
                customer: true,
                branch: true,
                user: {
                    select: {
                        id: true,
                        first_name: true,
                        last_name: true,
                        email: true,
                    },
                },
                items: {
                    include: {
                        product: true,
                    },
                },
                payments: {
                    include: {
                        pharmacy_payment_method: true,
                    },
                },
            },
        });
    }

    count(where: Prisma.InvoiceWhereInput) {
        return this.prisma.invoice.count({ where });
    }
}
