import { Injectable } from '@nestjs/common';
import { Prisma } from '@gen/prisma/client';

import { PrismaService } from '@/database/prisma/prisma.service';

import { CreateDosageFormDto, DosageFormQueryDto, UpdateDosageFormDto } from '../dtos';

@Injectable()
export class DosageFormsRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findMany(query: DosageFormQueryDto) {
        const { search, is_active, page, limit, sortBy, sortOrder } = query;

        const where: Prisma.DosageFormWhereInput = {
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

        const orderBy: Prisma.DosageFormOrderByWithRelationInput = {
            [(sortBy ?? 'name') as keyof Prisma.DosageFormOrderByWithRelationInput]:
                sortOrder ?? 'asc',
        };

        const isPaginated = page !== undefined && limit !== undefined;

        if (!isPaginated) {
            return this.prisma.dosageForm.findMany({
                where,
                orderBy,
            });
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
                deleted_at: null,

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
}
