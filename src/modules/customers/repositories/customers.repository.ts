import { Injectable } from '@nestjs/common';
import { Prisma } from '@gen/prisma/client';

import { PrismaService } from '@/database/prisma/prisma.service';

import { CustomerQueryDto } from '../dtos';

@Injectable()
export class CustomersRepository {
    constructor(private readonly prisma: PrismaService) {}

    private readonly customerRelations: Prisma.CustomerInclude = {
        pharmacy: true,
    };

    private getClient(tx?: Prisma.TransactionClient) {
        return tx ?? this.prisma;
    }

    private buildWhere(pharmacyId: string, query: CustomerQueryDto): Prisma.CustomerWhereInput {
        const { search, is_active, is_walk_in } = query;

        return {
            pharmacy_id: pharmacyId,

            deleted_at: null,

            ...(search && {
                OR: [
                    {
                        first_name: {
                            contains: search,
                            mode: 'insensitive',
                        },
                    },

                    {
                        last_name: {
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
                        customer_code: {
                            contains: search,
                            mode: 'insensitive',
                        },
                    },
                ],
            }),

            ...(is_active !== undefined && {
                is_active,
            }),

            ...(is_walk_in !== undefined && {
                is_walk_in,
            }),
        };
    }

    private buildOrderBy(
        sortBy?: string,
        sortOrder: Prisma.SortOrder = 'desc',
    ): Prisma.CustomerOrderByWithRelationInput {
        return {
            [(sortBy ?? 'created_at') as keyof Prisma.CustomerOrderByWithRelationInput]: sortOrder,
        };
    }

    async findMany(pharmacyId: string, query: CustomerQueryDto) {
        const { page, limit, sortBy, sortOrder } = query;

        const where = this.buildWhere(pharmacyId, query);

        const orderBy = this.buildOrderBy(sortBy, sortOrder);

        const isPaginated = page !== undefined && limit !== undefined;

        if (!isPaginated) {
            const records = await this.prisma.customer.findMany({
                where,

                orderBy,

                include: this.customerRelations,
            });
            return { records };
        }

        const [records, total] = await this.prisma.$transaction([
            this.prisma.customer.findMany({
                where,
                orderBy,
                include: this.customerRelations,
                skip: (page - 1) * limit,
                take: limit,
            }),

            this.prisma.customer.count({
                where,
            }),
        ]);

        return {
            records,
            total,
        };
    }

    findById(id: string, tx?: Prisma.TransactionClient) {
        return this.getClient(tx).customer.findFirst({
            where: {
                id,

                deleted_at: null,
            },

            include: this.customerRelations,
        });
    }

    findByPhone(
        pharmacyId: string,
        phone: string,
        excludeId?: string,
        tx?: Prisma.TransactionClient,
    ) {
        return this.getClient(tx).customer.findFirst({
            where: {
                pharmacy_id: pharmacyId,

                phone,

                deleted_at: null,

                ...(excludeId && {
                    NOT: {
                        id: excludeId,
                    },
                }),
            },
        });
    }

    findByEmail(
        pharmacyId: string,
        email: string,
        excludeId?: string,
        tx?: Prisma.TransactionClient,
    ) {
        return this.getClient(tx).customer.findFirst({
            where: {
                pharmacy_id: pharmacyId,

                email,

                deleted_at: null,

                ...(excludeId && {
                    NOT: {
                        id: excludeId,
                    },
                }),
            },
        });
    }

    findLatestCustomer(pharmacyId: string, tx?: Prisma.TransactionClient) {
        return this.getClient(tx).customer.findFirst({
            where: {
                pharmacy_id: pharmacyId,

                deleted_at: null,
            },

            orderBy: {
                created_at: 'desc',
            },

            select: {
                customer_code: true,
            },
        });
    }

    create(data: Prisma.CustomerCreateInput, tx?: Prisma.TransactionClient) {
        return this.getClient(tx).customer.create({
            data,

            include: this.customerRelations,
        });
    }

    update(id: string, data: Prisma.CustomerUpdateInput, tx?: Prisma.TransactionClient) {
        return this.getClient(tx).customer.update({
            where: {
                id,
            },

            data,

            include: this.customerRelations,
        });
    }

    delete(id: string, tx?: Prisma.TransactionClient) {
        return this.getClient(tx).customer.update({
            where: {
                id,
            },

            data: {
                deleted_at: new Date(),
            },
        });
    }

    findOrCreateWalkIn(pharmacyId: string) {
        return this.prisma.customer.upsert({
            where: {
                pharmacy_id_customer_code: {
                    pharmacy_id: pharmacyId,
                    customer_code: 'WALK-IN',
                },
            },

            update: {},

            create: {
                pharmacy_id: pharmacyId,

                customer_code: 'WALK-IN',

                first_name: 'Walk-in',

                last_name: 'Customer',

                is_walk_in: true,
            },
        });
    }
}
