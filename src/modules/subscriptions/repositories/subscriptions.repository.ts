import { Injectable } from '@nestjs/common';

import { Prisma, SubscriptionStatus } from '@prisma/client';

import { PrismaService } from '@/database/prisma/prisma.service';

import { SubscriptionQueryDto } from '../dtos';

@Injectable()
export class SubscriptionsRepository {
    constructor(private readonly prisma: PrismaService) {}

    private readonly subscriptionRelations: Prisma.SubscriptionInclude = {
        pharmacy: true,

        plan: true,

        payments: true,
    };

    private getClient(tx?: Prisma.TransactionClient) {
        return tx ?? this.prisma;
    }

    private buildWhere(query: SubscriptionQueryDto): Prisma.SubscriptionWhereInput {
        const { pharmacy_id, status } = query;

        return {
            ...(pharmacy_id && {
                pharmacy_id,
            }),

            ...(status && {
                status,
            }),
        };
    }

    private buildOrderBy(
        sortBy?: string,
        sortOrder: Prisma.SortOrder = 'desc',
    ): Prisma.SubscriptionOrderByWithRelationInput {
        return {
            [(sortBy ?? 'created_at') as keyof Prisma.SubscriptionOrderByWithRelationInput]:
                sortOrder,
        };
    }

    async findMany(query: SubscriptionQueryDto) {
        const { page, limit, sortBy, sortOrder } = query;

        const where = this.buildWhere(query);

        const orderBy = this.buildOrderBy(sortBy, sortOrder);

        const isPaginated = page !== undefined && limit !== undefined;

        if (!isPaginated) {
            return this.prisma.subscription.findMany({
                where,

                orderBy,

                include: this.subscriptionRelations,
            });
        }

        const [records, total] = await this.prisma.$transaction([
            this.prisma.subscription.findMany({
                where,

                orderBy,

                include: this.subscriptionRelations,

                skip: (page - 1) * limit,

                take: limit,
            }),

            this.prisma.subscription.count({
                where,
            }),
        ]);

        return {
            records,
            total,
        };
    }

    findById(id: string, tx?: Prisma.TransactionClient) {
        return this.getClient(tx).subscription.findUnique({
            where: {
                id,
            },

            include: this.subscriptionRelations,
        });
    }

    findActiveByPharmacyId(pharmacyId: string, tx?: Prisma.TransactionClient) {
        return this.getClient(tx).subscription.findFirst({
            where: {
                pharmacy_id: pharmacyId,

                status: {
                    in: [SubscriptionStatus.TRIAL, SubscriptionStatus.ACTIVE],
                },
            },

            include: this.subscriptionRelations,

            orderBy: {
                created_at: 'desc',
            },
        });
    }

    findLatestByPharmacyId(pharmacyId: string, tx?: Prisma.TransactionClient) {
        return this.getClient(tx).subscription.findFirst({
            where: {
                pharmacy_id: pharmacyId,
            },

            include: this.subscriptionRelations,

            orderBy: {
                created_at: 'desc',
            },
        });
    }

    create(data: Prisma.SubscriptionCreateInput, tx?: Prisma.TransactionClient) {
        return this.getClient(tx).subscription.create({
            data,

            include: this.subscriptionRelations,
        });
    }

    update(id: string, data: Prisma.SubscriptionUpdateInput, tx?: Prisma.TransactionClient) {
        return this.getClient(tx).subscription.update({
            where: {
                id,
            },

            data,

            include: this.subscriptionRelations,
        });
    }

    async findActiveSubscriptionByPharmacyId(pharmacyId: string) {
        return this.prisma.subscription.findFirst({
            where: {
                pharmacy_id: pharmacyId,
                status: {
                    in: ['ACTIVE', 'TRIAL'],
                },
            },
            include: {
                plan: true,
            },
            orderBy: {
                created_at: 'desc',
            },
        });
    }
}
