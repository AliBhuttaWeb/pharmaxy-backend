import { Injectable } from '@nestjs/common';
import { Prisma } from '@gen/prisma/client';

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

    async findMany(query: ProductQueryDto) {
        const {
            search,
            manufacturer_id,
            product_type_id,
            retail_category_id,
            dosage_form_id,
            requires_prescription,
            is_active,
            is_deleted,
            page,
            limit,
            sort_by,
            sort_order,
        } = query;

        const where: Prisma.ProductWhereInput = {
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
            [(sort_by ?? 'name') as keyof Prisma.ProductOrderByWithRelationInput]:
                sort_order ?? 'asc',
        };

        const isPaginated = page !== undefined && limit !== undefined;

        if (!isPaginated) {
            const records = await this.prisma.product.findMany({
                where,
                orderBy,
                include: this.productRelations,
            });
            return { records };
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
        return this.prisma.getClient(tx).product.findFirst({
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

    findByNameAndGenericName(
        name: string,
        genericName: string,
        excludeId?: string,
        tx?: Prisma.TransactionClient,
    ) {
        return this.prisma.getClient(tx).product.findFirst({
            where: {
                name: {
                    equals: name,
                    mode: 'insensitive',
                },
                generic_name: {
                    equals: genericName,
                    mode: 'insensitive',
                },
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
        return this.prisma.getClient(tx).product.create({
            data,
            include: this.productRelations,
        });
    }

    update(id: string, data: UpdateProductDto, tx?: Prisma.TransactionClient) {
        return this.prisma.getClient(tx).product.update({
            where: {
                id,
            },

            data,

            include: this.productRelations,
        });
    }

    async existsByDosageForm(dosageFormId: string): Promise<boolean> {
        const count = await this.prisma.product.count({
            where: {
                dosage_form_id: dosageFormId,
                deleted_at: null,
            },
        });
        return count > 0;
    }

    async existsByProductType(productTypeId: string): Promise<boolean> {
        const count = await this.prisma.product.count({
            where: {
                product_type_id: productTypeId,
                deleted_at: null,
            },
        });
        return count > 0;
    }

    async existsByRetailCategory(retailCategoryId: string): Promise<boolean> {
        const count = await this.prisma.product.count({
            where: {
                retail_category_id: retailCategoryId,
                deleted_at: null,
            },
        });
        return count > 0;
    }

    async existsByManufacturer(manufacturerId: string): Promise<boolean> {
        const count = await this.prisma.product.count({
            where: {
                manufacturer_id: manufacturerId,
                deleted_at: null,
            },
        });
        return count > 0;
    }

    delete(id: string, tx?: Prisma.TransactionClient) {
        return this.prisma.getClient(tx).product.update({
            where: {
                id,
            },

            data: {
                deleted_at: new Date(),
            },
        });
    }
}
