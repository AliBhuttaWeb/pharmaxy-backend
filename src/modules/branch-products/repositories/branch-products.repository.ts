import { Injectable } from '@nestjs/common';
import { BatchSourceType, Prisma } from '@gen/prisma/client';

import { PrismaService } from '@/database/prisma/prisma.service';

import {
    BranchProductQueryDto,
    CreateBranchProductDto,
    ReceiveStockDto,
    UpdateBranchProductDto,
} from '../dtos';

@Injectable()
export class BranchProductsRepository {
    constructor(private readonly prisma: PrismaService) {}

    private readonly branchProductRelations: Prisma.BranchProductInclude = {
        branch: true,
        product: true,
    };

    private getClient(tx?: Prisma.TransactionClient) {
        return tx ?? this.prisma;
    }

    private buildWhere(query: BranchProductQueryDto): Prisma.BranchProductWhereInput {
        const { search, branch_id, product_id, is_controlled_drug, is_active } = query;

        return {
            deleted_at: null,

            ...(search && {
                product: {
                    OR: [
                        {
                            name: {
                                contains: search,
                                mode: 'insensitive',
                            },
                        },
                        {
                            generic_name: {
                                contains: search,
                                mode: 'insensitive',
                            },
                        },
                        {
                            barcode: {
                                contains: search,
                                mode: 'insensitive',
                            },
                        },
                    ],
                },
            }),

            ...(branch_id && {
                branch_id,
            }),

            ...(product_id && {
                product_id,
            }),

            ...(is_controlled_drug !== undefined && {
                is_controlled_drug,
            }),

            ...(is_active !== undefined && {
                is_active,
            }),
        };
    }

    private buildOrderBy(
        sortBy?: string,
        sortOrder: Prisma.SortOrder = 'desc',
    ): Prisma.BranchProductOrderByWithRelationInput {
        return {
            [(sortBy ?? 'created_at') as keyof Prisma.BranchProductOrderByWithRelationInput]:
                sortOrder,
        };
    }

    async findMany(query: BranchProductQueryDto) {
        const { page, limit, sortBy, sortOrder } = query;

        const where = this.buildWhere(query);

        const orderBy = this.buildOrderBy(sortBy, sortOrder);

        const isPaginated = page !== undefined && limit !== undefined;

        if (!isPaginated) {
            const records = await this.prisma.branchProduct.findMany({
                where,
                orderBy,
                include: this.branchProductRelations,
            });
            return { records };
        }

        const [records, total] = await this.prisma.$transaction([
            this.prisma.branchProduct.findMany({
                where,
                orderBy,
                include: this.branchProductRelations,
                skip: (page - 1) * limit,
                take: limit,
            }),

            this.prisma.branchProduct.count({
                where,
            }),
        ]);

        return {
            records,
            total,
        };
    }

    findById(id: string, tx?: Prisma.TransactionClient) {
        return this.getClient(tx).branchProduct.findFirst({
            where: {
                id,
                deleted_at: null,
            },
            include: this.branchProductRelations,
        });
    }

    findByBranchAndProduct(
        branchId: string,
        productId: string,
        excludeId?: string,
        tx?: Prisma.TransactionClient,
    ) {
        return this.getClient(tx).branchProduct.findFirst({
            where: {
                branch_id: branchId,
                product_id: productId,
                deleted_at: null,

                ...(excludeId && {
                    NOT: {
                        id: excludeId,
                    },
                }),
            },
        });
    }

    create(data: CreateBranchProductDto, tx?: Prisma.TransactionClient) {
        return this.getClient(tx).branchProduct.create({
            data,
            include: this.branchProductRelations,
        });
    }

    update(id: string, data: UpdateBranchProductDto, tx?: Prisma.TransactionClient) {
        return this.getClient(tx).branchProduct.update({
            where: {
                id,
            },
            data,
            include: this.branchProductRelations,
        });
    }

    updateQuantity(id: string, quantity: number, tx?: Prisma.TransactionClient) {
        return this.getClient(tx).branchProduct.update({
            where: {
                id,
            },
            data: {
                quantity,
            },
            include: this.branchProductRelations,
        });
    }

    delete(id: string, tx?: Prisma.TransactionClient) {
        return this.getClient(tx).branchProduct.update({
            where: {
                id,
            },
            data: {
                deleted_at: new Date(),
            },
        });
    }

    findByBranchAndProductOrFail(branchId: string, productId: string) {
        return this.prisma.branchProduct.findFirstOrThrow({
            where: {
                branch_id: branchId,
                product_id: productId,
                deleted_at: null,
            },
            include: this.branchProductRelations,
        });
    }

    createBatch(branchProductId: string, data: ReceiveStockDto, tx?: Prisma.TransactionClient) {
        return this.getClient(tx).productBatch.create({
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

    findBatches(branchProductId: string, tx?: Prisma.TransactionClient) {
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
