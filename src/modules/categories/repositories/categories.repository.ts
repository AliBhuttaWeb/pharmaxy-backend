import { Injectable } from '@nestjs/common';

import { Prisma } from '@prisma/client';
import { PrismaService } from '@/database/prisma/prisma.service';

import {
    CreateCategoryDto,
    FindCategoriesQueryDto,
    UpdateCategoryDto,
} from '../dtos';

@Injectable()
export class CategoriesRepository {
    constructor(
        private readonly prisma: PrismaService,
    ) {}

    async findMany(
        query: FindCategoriesQueryDto,
    ) {
        const {
            search,
            parent_id,
            page,
            limit,
            sort_by,
            sort_order,
        } = query;

        const where: Prisma.ProductCategoryWhereInput = {
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

            ...(parent_id && {
                parent_id,
            }),
        };

        const sortableFields = [
            'name',
            'created_at',
            'updated_at',
        ] as const;

        const orderBy: Prisma.ProductCategoryOrderByWithRelationInput =
            {
                [
                    sortableFields.includes(
                        (sort_by as (typeof sortableFields)[number]) ??
                            'created_at',
                    )
                        ? (sort_by as keyof Prisma.ProductCategoryOrderByWithRelationInput)
                        : 'created_at'
                ]: sort_order ?? 'desc',
            };

        const isPaginated =
            page !== undefined &&
            limit !== undefined;

        if (!isPaginated) {
            return this.prisma.productCategory.findMany({
                where,
                orderBy,
            });
        }

        const [records, total] =
            await this.prisma.$transaction([
                this.prisma.productCategory.findMany({
                    where,
                    orderBy,
                    skip: (page - 1) * limit,
                    take: limit,
                }),
                this.prisma.productCategory.count({
                    where,
                }),
            ]);

        return {
            records,
            total,
        };
    }

    findById(id: string) {
        return this.prisma.productCategory.findFirst({
            where: {
                id,
                deleted_at: null,
            },
        });
    }

    findFirst(
        where: Prisma.ProductCategoryWhereInput,
    ) {
        return this.prisma.productCategory.findFirst({
            where: {
                ...where,
                deleted_at: null,
            },
        });
    }

    create(
        dto: CreateCategoryDto,
    ) {
        return this.prisma.productCategory.create({
            data: dto,
        });
    }

    update(
        id: string,
        dto: UpdateCategoryDto,
    ) {
        return this.prisma.productCategory.update({
            where: {
                id,
            },
            data: dto,
        });
    }

    delete(id: string) {
        return this.prisma.productCategory.update({
            where: {
                id,
            },
            data: {
                deleted_at: new Date(),
            },
        });
    }
}