import { Injectable } from '@nestjs/common';
import { Prisma } from '@gen/prisma/client';

import { PrismaService } from '@/database/prisma/prisma.service';

import {
    BranchProductQueryDto,
    BranchProductFieldsDto,
    UpdateBranchProductDto,
} from '../dtos';

@Injectable()
export class BranchProductsRepository {
    constructor(private readonly prisma: PrismaService) {}

    private readonly branchProductRelations: Prisma.BranchProductInclude = {
        branch: {
            select: {
                id: true,
                name: true,
                pharmacy_id: true,
            },
        },
        product: {
            select: {
                name: true,
                generic_name: true,
                strength: true,
                pack_quantity: true,
                pack_unit: true,
                is_active: true,
                manufacturer: {
                    select: { name: true, description: true },
                },
                product_type: {
                    select: { name: true, description: true },
                },
                retail_category: {
                    select: { name: true, description: true },
                },
                dosage_form: {
                    select: { name: true, description: true },
                },
            },
        },
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
        sort_by?: string,
        sort_order: Prisma.SortOrder = 'desc',
    ): Prisma.BranchProductOrderByWithRelationInput {
        return {
            [(sort_by ?? 'created_at') as keyof Prisma.BranchProductOrderByWithRelationInput]:
                sort_order,
        };
    }

    async findMany(query: BranchProductQueryDto) {
        const { page, limit, sort_by, sort_order } = query;

        const where = this.buildWhere(query);

        const orderBy = this.buildOrderBy(sort_by, sort_order);

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

    findById(id: string, branchId: string, tx?: Prisma.TransactionClient) {
        return this.prisma.getClient(tx).branchProduct.findFirst({
            where: {
                id,
                deleted_at: null,
                branch_id: branchId,
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
        return this.prisma.getClient(tx).branchProduct.findFirst({
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

    create(
        branchId: string,
        data: BranchProductFieldsDto & { quantity?: number },
        tx?: Prisma.TransactionClient,
    ) {
        return this.prisma.getClient(tx).branchProduct.create({
            data: { ...data, branch_id: branchId },
            include: this.branchProductRelations,
        });
    }

    update(id: string, data: UpdateBranchProductDto, tx?: Prisma.TransactionClient) {
        return this.prisma.getClient(tx).branchProduct.update({
            where: {
                id,
            },
            data,
            include: this.branchProductRelations,
        });
    }

    updateQuantity(id: string, quantity: number, tx?: Prisma.TransactionClient) {
        return this.prisma.getClient(tx).branchProduct.update({
            where: {
                id,
            },
            data: {
                quantity,
            },
            include: this.branchProductRelations,
        });
    }

    incrementQuantity(id: string, quantity: number, tx?: Prisma.TransactionClient) {
        return this.prisma.getClient(tx).branchProduct.update({
            where: {
                id,
            },
            data: {
                quantity: {
                    increment: quantity,
                },
            },
            include: this.branchProductRelations,
        });
    }

    decrementQuantity(id: string, quantity: number, tx?: Prisma.TransactionClient) {
        return this.prisma.getClient(tx).branchProduct.update({
            where: {
                id,
            },
            data: {
                quantity: {
                    decrement: quantity,
                },
            },
            include: this.branchProductRelations,
        });
    }

    delete(id: string, tx?: Prisma.TransactionClient) {
        return this.prisma.getClient(tx).branchProduct.update({
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
}
