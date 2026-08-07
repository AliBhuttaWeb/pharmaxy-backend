import { Injectable } from '@nestjs/common';

import { Prisma, SupplierStatus } from '@gen/prisma/client';
import { PrismaService } from '@/database/prisma/prisma.service';

import { CreateSupplierDto, FindSuppliersQueryDto, UpdateSupplierDto } from '../dtos';

@Injectable()
export class SuppliersRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findMany(query: FindSuppliersQueryDto) {
        const { search, pharmacy_id, status, page, limit, sort_by, sort_order } = query;

        const where: Prisma.SupplierWhereInput = {
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
                        company_name: {
                            contains: search,
                            mode: 'insensitive',
                        },
                    },
                    {
                        contact_person: {
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
                        email: {
                            contains: search,
                            mode: 'insensitive',
                        },
                    },
                    {
                        city: {
                            contains: search,
                            mode: 'insensitive',
                        },
                    },
                ],
            }),

            ...(pharmacy_id && {
                pharmacy_id,
            }),

            ...(status && {
                status,
            }),
        };

        const sortableFields = [
            'name',
            'company_name',
            'contact_person',
            'city',
            'status',
            'created_at',
            'updated_at',
        ] as const;

        const orderBy: Prisma.SupplierOrderByWithRelationInput = {
            [sortableFields.includes((sort_by as (typeof sortableFields)[number]) ?? 'created_at')
                ? (sort_by as keyof Prisma.SupplierOrderByWithRelationInput)
                : 'created_at']: sort_order ?? 'desc',
        };

        const isPaginated = page !== undefined && limit !== undefined;

        if (!isPaginated) {
            return this.prisma.supplier.findMany({
                where,
                orderBy,
            });
        }

        const [records, total] = await this.prisma.$transaction([
            this.prisma.supplier.findMany({
                where,
                orderBy,
                skip: (page - 1) * limit,
                take: limit,
            }),
            this.prisma.supplier.count({
                where,
            }),
        ]);

        return {
            records,
            total,
        };
    }

    findById(id: string) {
        return this.prisma.supplier.findFirst({
            where: {
                id,
                deleted_at: null,
            },
        });
    }

    findByName(pharmacyId: string, name: string) {
        return this.prisma.supplier.findFirst({
            where: {
                pharmacy_id: pharmacyId,
                name,
                deleted_at: null,
            },
        });
    }

    create(dto: CreateSupplierDto) {
        const { pharmacy_id, ...data } = dto;

        return this.prisma.supplier.create({
            data: {
                ...data,
                pharmacy: {
                    connect: {
                        id: pharmacy_id,
                    },
                },
            },
        });
    }

    update(id: string, dto: UpdateSupplierDto) {
        return this.prisma.supplier.update({
            where: {
                id,
            },
            data: dto,
        });
    }

    updateStatus(id: string, status: SupplierStatus) {
        return this.prisma.supplier.update({
            where: {
                id,
            },
            data: {
                status,
            },
        });
    }

    delete(id: string) {
        return this.prisma.supplier.update({
            where: {
                id,
            },
            data: {
                deleted_at: new Date(),
            },
        });
    }
}
