import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '@/database/prisma/prisma.service';

import { CreateProductDto, ProductQueryDto, UpdateProductDto } from '../dtos';

@Injectable()
export class ProductsRepository {
    constructor(private readonly prisma: PrismaService) {}

    private readonly productRelations: Prisma.ProductInclude = {
        manufacturer: true,
        product_type: true,
        retail_category: true,
        dosage_form: true,
    };

    private getClient(tx?: Prisma.TransactionClient) {
        return tx ?? this.prisma;
    }
    async findMany(query: ProductQueryDto) {
        const {
            search,
            manufacturer_id,
            product_type_id,
            retail_category_id,
            dosage_form_id,
            requires_prescription,
            is_active,
            page,
            limit,
            sortBy,
            sortOrder,
        } = query;

        const where: Prisma.ProductWhereInput = {
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
            }),

            ...(manufacturer_id && {
                manufacturer_id,
            }),

            ...(product_type_id && {
                product_type_id,
            }),

            ...(retail_category_id && {
                retail_category_id,
            }),

            ...(dosage_form_id && {
                dosage_form_id,
            }),

            ...(requires_prescription !== undefined && {
                requires_prescription,
            }),

            ...(is_active !== undefined && {
                is_active,
            }),
        };

        const orderBy: Prisma.ProductOrderByWithRelationInput = {
            [(sortBy ?? 'name') as keyof Prisma.ProductOrderByWithRelationInput]:
                sortOrder ?? 'asc',
        };

        const isPaginated = page !== undefined && limit !== undefined;

        if (!isPaginated) {
            return this.prisma.product.findMany({
                where,
                orderBy,
                include: this.productRelations,
            });
        }

        const [records, total] = await this.prisma.$transaction([
            this.prisma.product.findMany({
                where,
                orderBy,
                include: this.productRelations,
                skip: (page - 1) * limit,
                take: limit,
            }),

            this.prisma.product.count({
                where,
            }),
        ]);

        return {
            records,
            total,
        };
    }

    findById(id: string) {
        return this.prisma.product.findFirst({
            where: {
                id,
                deleted_at: null,
            },

            include: this.productRelations,
        });
    }

    findByBarcode(barcode: string, excludeId?: string, tx?: Prisma.TransactionClient) {
        return this.getClient(tx).product.findFirst({
            where: {
                barcode,
                deleted_at: null,

                ...(excludeId && {
                    NOT: {
                        id: excludeId,
                    },
                }),
            },
        });
    }

    create(data: CreateProductDto, tx?: Prisma.TransactionClient) {
        return this.getClient(tx).product.create({
            data,
            include: this.productRelations,
        });
    }

    update(id: string, data: UpdateProductDto, tx?: Prisma.TransactionClient) {
        return this.getClient(tx).product.update({
            where: {
                id,
            },

            data,

            include: this.productRelations,
        });
    }

    delete(id: string, tx?: Prisma.TransactionClient) {
        return this.getClient(tx).product.update({
            where: {
                id,
            },

            data: {
                deleted_at: new Date(),
            },
        });
    }
}
