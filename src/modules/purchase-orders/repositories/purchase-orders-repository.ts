import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '@/database/prisma/prisma.service';

import { PurchaseOrderQueryDto } from '../dtos';

@Injectable()
export class PurchaseOrdersRepository {
    constructor(private readonly prisma: PrismaService) {}

    private readonly purchaseOrderRelations: Prisma.PurchaseOrderInclude = {
        pharmacy: true,
        branch: true,
        supplier: true,
        items: {
            include: {
                product: true,
                product_batches: true,
            },
        },
    };

    private getClient(tx?: Prisma.TransactionClient) {
        return tx ?? this.prisma;
    }

    private buildWhere(query: PurchaseOrderQueryDto): Prisma.PurchaseOrderWhereInput {
        const { search, branch_id, supplier_id, status, from_date, to_date } = query;

        return {
            deleted_at: null,

            ...(search && {
                OR: [
                    {
                        purchase_order_number: {
                            contains: search,
                            mode: 'insensitive',
                        },
                    },
                    {
                        supplier: {
                            name: {
                                contains: search,
                                mode: 'insensitive',
                            },
                        },
                    },
                ],
            }),

            ...(branch_id && {
                branch_id,
            }),

            ...(supplier_id && {
                supplier_id,
            }),

            ...(status && {
                status,
            }),

            ...((from_date || to_date) && {
                order_date: {
                    ...(from_date && {
                        gte: new Date(from_date),
                    }),
                    ...(to_date && {
                        lte: new Date(to_date),
                    }),
                },
            }),
        };
    }

    private buildOrderBy(
        sortBy?: string,
        sortOrder: Prisma.SortOrder = 'desc',
    ): Prisma.PurchaseOrderOrderByWithRelationInput {
        return {
            [(sortBy ?? 'created_at') as keyof Prisma.PurchaseOrderOrderByWithRelationInput]:
                sortOrder,
        };
    }

    async findMany(query: PurchaseOrderQueryDto) {
        const { page, limit, sortBy, sortOrder } = query;

        const where = this.buildWhere(query);

        const orderBy = this.buildOrderBy(sortBy, sortOrder);

        const isPaginated = page !== undefined && limit !== undefined;

        if (!isPaginated) {
            return this.prisma.purchaseOrder.findMany({
                where,
                orderBy,
                include: this.purchaseOrderRelations,
            });
        }

        const [records, total] = await this.prisma.$transaction([
            this.prisma.purchaseOrder.findMany({
                where,
                orderBy,
                include: this.purchaseOrderRelations,
                skip: (page - 1) * limit,
                take: limit,
            }),

            this.prisma.purchaseOrder.count({
                where,
            }),
        ]);

        return {
            records,
            total,
        };
    }

    findById(id: string, tx?: Prisma.TransactionClient) {
        return this.getClient(tx).purchaseOrder.findFirst({
            where: {
                id,
                deleted_at: null,
            },
            include: this.purchaseOrderRelations,
        });
    }

    findLatestPurchaseOrder(branchId: string, tx?: Prisma.TransactionClient) {
        return this.getClient(tx).purchaseOrder.findFirst({
            where: {
                branch_id: branchId,
                deleted_at: null,
            },
            orderBy: {
                created_at: 'desc',
            },
            select: {
                purchase_order_number: true,
            },
        });
    }

    findByBranchAndNumber(
        branchId: string,
        purchaseOrderNumber: string,
        excludeId?: string,
        tx?: Prisma.TransactionClient,
    ) {
        return this.getClient(tx).purchaseOrder.findFirst({
            where: {
                branch_id: branchId,
                purchase_order_number: purchaseOrderNumber,
                deleted_at: null,

                ...(excludeId && {
                    NOT: {
                        id: excludeId,
                    },
                }),
            },
        });
    }

    create(data: Prisma.PurchaseOrderCreateInput, tx?: Prisma.TransactionClient) {
        return this.getClient(tx).purchaseOrder.create({
            data,
            include: this.purchaseOrderRelations,
        });
    }

    update(id: string, data: Prisma.PurchaseOrderUpdateInput, tx?: Prisma.TransactionClient) {
        return this.getClient(tx).purchaseOrder.update({
            where: {
                id,
            },
            data,
            include: this.purchaseOrderRelations,
        });
    }

    delete(id: string, tx?: Prisma.TransactionClient) {
        return this.getClient(tx).purchaseOrder.update({
            where: {
                id,
            },
            data: {
                deleted_at: new Date(),
            },
        });
    }

    findPurchaseOrderItemById(id: string, tx?: Prisma.TransactionClient) {
        return this.getClient(tx).purchaseOrderItem.findUnique({
            where: {
                id,
            },
            include: {
                product: true,
                purchase_order: true,
                product_batches: true,
            },
        });
    }

    updatePurchaseOrderItem(
        id: string,
        data: Prisma.PurchaseOrderItemUpdateInput,
        tx?: Prisma.TransactionClient,
    ) {
        return this.getClient(tx).purchaseOrderItem.update({
            where: {
                id,
            },
            data,
            include: {
                product: true,
                purchase_order: true,
                product_batches: true,
            },
        });
    }
}
