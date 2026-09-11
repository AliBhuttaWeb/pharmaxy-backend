import { Injectable } from '@nestjs/common';
import { Prisma } from '@gen/prisma/client';

import { PrismaService } from '@/database/prisma/prisma.service';

import { CreateDosageFormDto, DosageFormQueryDto, UpdateDosageFormDto } from '../dtos';

@Injectable()
export class DosageFormsRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findMany(query: DosageFormQueryDto) {
        const { search, is_deleted, page, limit, sort_by, sort_order } = query;

        const where: Prisma.DosageFormWhereInput = {
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
        };

        const sortableFields = ['name', 'created_at', 'updated_at'] as const;
        type SortableField = (typeof sortableFields)[number];

        const field: SortableField =
            sort_by && sortableFields.includes(sort_by as SortableField)
                ? (sort_by as SortableField)
                : 'name';

        const orderBy: Prisma.DosageFormOrderByWithRelationInput = {
            [field]: sort_order || 'asc',
        };

        const isPaginated = page !== undefined && limit !== undefined;

        if (!isPaginated) {
            const records = await this.prisma.dosageForm.findMany({
                where,
                orderBy,
            });
            return { records };
        }

        const [records, total] = await this.prisma.$transaction([
            this.prisma.dosageForm.findMany({
                where,
                orderBy,
                skip: (page - 1) * limit,
                take: limit,
            }),

            this.prisma.dosageForm.count({
                where,
            }),
        ]);

        return {
            records,
            total,
        };
    }

    findById(id: string) {
        return this.prisma.dosageForm.findFirst({
            where: {
                id,
                deleted_at: null,
            },
        });
    }

    findByName(name: string, excludeId?: string) {
        return this.prisma.dosageForm.findFirst({
            where: {
                name,

                ...(excludeId && {
                    NOT: {
                        id: excludeId,
                    },
                }),
            },
        });
    }

    create(data: CreateDosageFormDto) {
        return this.prisma.dosageForm.create({
            data,
        });
    }

    update(id: string, data: UpdateDosageFormDto) {
        return this.prisma.dosageForm.update({
            where: {
                id,
            },
            data,
        });
    }

    delete(id: string) {
        return this.prisma.dosageForm.update({
            where: {
                id,
            },
            data: {
                deleted_at: new Date(),
            },
        });
    }

    async hasProducts(id: string): Promise<boolean> {
        const result = await this.prisma.dosageForm.findUnique({
            where: { id },
            select: {
                _count: {
                    select: {
                        products: {
                            where: { deleted_at: null },
                        },
                    },
                },
            },
        });

        return (result?._count?.products ?? 0) > 0;
    }
}
