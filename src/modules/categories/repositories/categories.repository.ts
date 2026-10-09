import { Injectable } from '@nestjs/common';
import { Prisma } from '@gen/prisma/client';

import { PrismaService } from '@/database/prisma/prisma.service';

import { CreateCategoryDto, CategoryQueryDto, UpdateCategoryDto } from '../dtos';

@Injectable()
export class CategoriesRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findMany(query: CategoryQueryDto) {
        const { search, is_active, is_deleted, page, limit, sort_by, sort_order } = query;

        const where: Prisma.CategoryWhereInput = {
            ...(is_deleted !== undefined && {
                deleted_at: is_deleted ? { not: null } : null,
            }),

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

        const field: SortableField =
            sort_by && sortableFields.includes(sort_by as SortableField)
                ? (sort_by as SortableField)
                : 'name';

        const orderBy: Prisma.CategoryOrderByWithRelationInput = {
            [field]: sort_order || 'asc',
        };

        const isPaginated = page !== undefined && limit !== undefined;

        if (!isPaginated) {
            const records = await this.prisma.category.findMany({
                where,
                orderBy,
            });
            return { records };
        }

        const [records, total] = await this.prisma.$transaction([
            this.prisma.category.findMany({
                where,
                orderBy,
                skip: (page - 1) * limit,
                take: limit,
            }),
            this.prisma.category.count({
                where,
            }),
        ]);

        return {
            records,
            total,
        };
    }

    findById(id: string) {
        return this.prisma.category.findFirst({
            where: {
                id,
                deleted_at: null,
            },
        });
    }

    findByName(name: string, excludeId?: string) {
        return this.prisma.category.findFirst({
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

    create(data: CreateCategoryDto) {
        return this.prisma.category.create({
            data,
        });
    }

    update(id: string, data: UpdateCategoryDto) {
        return this.prisma.category.update({
            where: {
                id,
            },
            data,
        });
    }

    delete(id: string) {
        return this.prisma.category.update({
            where: {
                id,
            },
            data: {
                deleted_at: new Date(),
            },
        });
    }
}
