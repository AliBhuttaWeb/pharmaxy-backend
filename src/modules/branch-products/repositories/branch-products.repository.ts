import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '@/database/prisma/prisma.service';

import { BranchProductQueryDto, CreateBranchProductDto, UpdateBranchProductDto } from '../dtos';

@Injectable()
export class BranchProductsRepository {
    constructor(private readonly prisma: PrismaService) {}

    private readonly branchProductRelations: Prisma.BranchProductInclude = {
        branch: true,
        product: true,
    };

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
            return this.prisma.branchProduct.findMany({
                where,
                orderBy,
                include: this.branchProductRelations,
            });
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

    findById(id: string) {
        return this.prisma.branchProduct.findFirst({
            where: {
                id,
                deleted_at: null,
            },
            include: this.branchProductRelations,
        });
    }

    findByBranchAndProduct(branchId: string, productId: string, excludeId?: string) {
        return this.prisma.branchProduct.findFirst({
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

    create(data: CreateBranchProductDto) {
        return this.prisma.branchProduct.create({
            data,
            include: this.branchProductRelations,
        });
    }

    update(id: string, data: UpdateBranchProductDto) {
        return this.prisma.branchProduct.update({
            where: {
                id,
            },
            data,
            include: this.branchProductRelations,
        });
    }

    updateQuantity(id: string, quantity: number, tx?: Prisma.TransactionClient) {
        const client = tx ?? this.prisma;

        return client.branchProduct.update({
            where: {
                id,
            },
            data: {
                quantity,
            },
        });
    }

    delete(id: string) {
        return this.prisma.branchProduct.update({
            where: {
                id,
            },
            data: {
                deleted_at: new Date(),
            },
        });
    }

    findByBranchAndProductOrFail(branchId: string, productId: string) {
        return this.prisma.branchProduct.findFirst({
            where: {
                branch_id: branchId,
                product_id: productId,
                deleted_at: null,
            },
            include: this.branchProductRelations,
        });
    }
}
