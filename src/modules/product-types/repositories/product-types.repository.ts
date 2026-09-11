import { Injectable } from '@nestjs/common';
import { Prisma } from '@gen/prisma/client';

import { PrismaService } from '@/database/prisma/prisma.service';

import { CreateProductTypeDto, ProductTypeQueryDto, UpdateProductTypeDto } from '../dtos';

@Injectable()
export class ProductTypesRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findMany(query: ProductTypeQueryDto) {
        const { search, is_active, page, limit, sortBy, sortOrder } = query;

        const where: Prisma.ProductTypeWhereInput = {
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

        const orderBy: Prisma.ProductTypeOrderByWithRelationInput = {
            [field]: requestedSortOrder,
        };

        const isPaginated = page !== undefined && limit !== undefined;

        if (!isPaginated) {
            const records = await this.prisma.productType.findMany({
                where,
                orderBy,
            });
            return { records };
        }

        const [records, total] = await this.prisma.$transaction([
            this.prisma.productType.findMany({
                where,
                orderBy,
                skip: (page - 1) * limit,
                take: limit,
            }),

            this.prisma.productType.count({
                where,
            }),
        ]);

        return {
            records,
            total,
        };
    }

    findById(id: string) {
        return this.prisma.productType.findFirst({
            where: {
                id,
                deleted_at: null,
            },
        });
    }

    findByName(name: string, excludeId?: string) {
        return this.prisma.productType.findFirst({
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

    create(data: CreateProductTypeDto) {
        return this.prisma.productType.create({
            data,
        });
    }

    update(id: string, data: UpdateProductTypeDto) {
        return this.prisma.productType.update({
            where: {
                id,
            },
            data,
        });
    }

    delete(id: string) {
        return this.prisma.productType.update({
            where: {
                id,
            },
            data: {
                deleted_at: new Date(),
            },
        });
    }
}
