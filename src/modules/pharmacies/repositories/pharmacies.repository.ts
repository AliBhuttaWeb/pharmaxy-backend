import { Injectable } from '@nestjs/common';

import { Prisma, PharmacyStatus } from '@gen/prisma/client';
import { PrismaService } from '@/database/prisma/prisma.service';

import { FindPharmaciesQueryDto } from '../dtos';

@Injectable()
export class PharmaciesRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findMany(query: FindPharmaciesQueryDto) {
        const { search, status, page, limit, sort_by, sort_order } = query;

        const where: Prisma.PharmacyWhereInput = {
            ...(search && {
                OR: [
                    {
                        name: {
                            contains: search,
                            mode: 'insensitive',
                        },
                    },
                    {
                        legal_name: {
                            contains: search,
                            mode: 'insensitive',
                        },
                    },
                    {
                        registration_number: {
                            contains: search,
                            mode: 'insensitive',
                        },
                    },
                    {
                        license_number: {
                            contains: search,
                            mode: 'insensitive',
                        },
                    },
                    {
                        tax_number: {
                            contains: search,
                            mode: 'insensitive',
                        },
                    },
                    {
                        email: {
                            contains: search,
                            mode: 'insensitive',
                        },
                    },
                    {
                        phone: {
                            contains: search,
                            mode: 'insensitive',
                        },
                    },
                    {
                        website: {
                            contains: search,
                            mode: 'insensitive',
                        },
                    },
                ],
            }),

            ...(status && {
                status,
            }),

            deleted_at: null,
        };

        const sortableFields = [
            'name',
            'legal_name',
            'email',
            'phone',
            'status',
            'created_at',
            'updated_at',
        ] as const;

        const orderBy: Prisma.PharmacyOrderByWithRelationInput = {
            [sortableFields.includes((sort_by as (typeof sortableFields)[number]) ?? 'created_at')
                ? (sort_by as keyof Prisma.PharmacyOrderByWithRelationInput)
                : 'created_at']: sort_order ?? 'desc',
        };

        const isPaginated = page !== undefined && limit !== undefined;

        if (!isPaginated) {
            return this.prisma.pharmacy.findMany({
                where,
                orderBy,
            });
        }

        const [records, total] = await this.prisma.$transaction([
            this.prisma.pharmacy.findMany({
                where,
                orderBy,
                skip: (page - 1) * limit,
                take: limit,
            }),
            this.prisma.pharmacy.count({
                where,
            }),
        ]);

        return {
            records,
            total,
        };
    }

    findById(id: string) {
        return this.prisma.pharmacy.findFirst({
            where: {
                id,
                deleted_at: null,
            },
        });
    }

    findByName(name: string) {
        return this.prisma.pharmacy.findFirst({
            where: {
                name,
                deleted_at: null,
            },
        });
    }

    create(data: Prisma.PharmacyCreateInput) {
        return this.prisma.pharmacy.create({
            data,
        });
    }

    update(id: string, data: Prisma.PharmacyUpdateInput) {
        return this.prisma.pharmacy.update({
            where: {
                id,
            },
            data,
        });
    }

    updateStatus(id: string, status: PharmacyStatus) {
        return this.prisma.pharmacy.update({
            where: {
                id,
            },
            data: {
                status,
            },
        });
    }

    delete(id: string) {
        return this.prisma.pharmacy.update({
            where: {
                id,
            },
            data: {
                deleted_at: new Date(),
            },
        });
    }
}
