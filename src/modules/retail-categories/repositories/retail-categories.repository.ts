import { Injectable } from '@nestjs/common';
import { Prisma } from '@gen/prisma/client';

import { PrismaService } from '@/database/prisma/prisma.service';

import { CreateRetailCategoryDto, RetailCategoryQueryDto, UpdateRetailCategoryDto } from '../dtos';

@Injectable()
export class RetailCategoriesRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findMany(query: RetailCategoryQueryDto) {
        const { search, is_active, page, limit, sortBy, sortOrder } = query;

        const where: Prisma.RetailCategoryWhereInput = {
            deleted_at: null,

            ...(search && {
                OR: [
                    {
                        name: {
                            contains: search,
                            mode: 'insensitive',
                        },
                    },
                    {
                        description: {
                            contains: search,
                            mode: 'insensitive',
                        },
                    },
                ],
            }),

            ...(is_active !== undefined && {
                is_active,
            }),
        };

        const sortableFields = ['name', 'is_active', 'created_at', 'updated_at'] as const;
        type SortableField = (typeof sortableFields)[number];

        const requestedSortBy = (query as any).sort_by || sortBy;
        const requestedSortOrder = (query as any).sort_order || sortOrder || 'asc';

        const field: SortableField =
            requestedSortBy && sortableFields.includes(requestedSortBy as SortableField)
                ? (requestedSortBy as SortableField)
                : 'name';

        const orderBy: Prisma.RetailCategoryOrderByWithRelationInput = {
            [field]: requestedSortOrder,
        };

        const isPaginated = page !== undefined && limit !== undefined;

        if (!isPaginated) {
            const records = await this.prisma.retailCategory.findMany({
                where,
                orderBy,
            });
            return { records };
        }

        const [records, total] = await this.prisma.$transaction([
            this.prisma.retailCategory.findMany({
                where,
                orderBy,
                skip: (page - 1) * limit,
                take: limit,
            }),
            this.prisma.retailCategory.count({
                where,
            }),
        ]);

        return {
            records,
            total,
        };
    }

    findById(id: string) {
        return this.prisma.retailCategory.findFirst({
            where: {
                id,
                deleted_at: null,
            },
        });
    }

    findByName(name: string, excludeId?: string) {
        return this.prisma.retailCategory.findFirst({
            where: {
                name,
                deleted_at: null,

                ...(excludeId && {
                    NOT: {
                        id: excludeId,
                    },
                }),
            },
        });
    }

    create(data: CreateRetailCategoryDto) {
        return this.prisma.retailCategory.create({
            data,
        });
    }

    update(id: string, data: UpdateRetailCategoryDto) {
        return this.prisma.retailCategory.update({
            where: {
                id,
            },
            data,
        });
    }

    delete(id: string) {
        return this.prisma.retailCategory.update({
            where: {
                id,
            },
            data: {
                deleted_at: new Date(),
            },
        });
    }
}
