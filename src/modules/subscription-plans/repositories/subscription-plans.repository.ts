import { Injectable } from '@nestjs/common';

import { Prisma } from '@prisma/client';

import { PrismaService } from '@/database/prisma/prisma.service';

import { SubscriptionPlanQueryDto } from '../dtos';

@Injectable()
export class SubscriptionPlansRepository {
    constructor(private readonly prisma: PrismaService) {}

    private readonly subscriptionPlanRelations: Prisma.SubscriptionPlanInclude = {
        subscriptions: false,
    };

    private getClient(tx?: Prisma.TransactionClient) {
        return tx ?? this.prisma;
    }

    private buildWhere(query: SubscriptionPlanQueryDto): Prisma.SubscriptionPlanWhereInput {
        const { search, billing_cycle, is_active } = query;

        return {
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

            ...(billing_cycle && {
                billing_cycle,
            }),

            ...(is_active !== undefined && {
                is_active,
            }),
        };
    }

    private buildOrderBy(
        sortBy?: string,
        sortOrder: Prisma.SortOrder = 'desc',
    ): Prisma.SubscriptionPlanOrderByWithRelationInput {
        return {
            [(sortBy ?? 'created_at') as keyof Prisma.SubscriptionPlanOrderByWithRelationInput]:
                sortOrder,
        };
    }

    async findMany(query: SubscriptionPlanQueryDto) {
        const { page, limit, sortBy, sortOrder } = query;

        const where = this.buildWhere(query);

        const orderBy = this.buildOrderBy(sortBy, sortOrder);

        const isPaginated = page !== undefined && limit !== undefined;

        if (!isPaginated) {
            return this.prisma.subscriptionPlan.findMany({
                where,
                orderBy,
                include: this.subscriptionPlanRelations,
            });
        }

        const [records, total] = await this.prisma.$transaction([
            this.prisma.subscriptionPlan.findMany({
                where,
                orderBy,
                include: this.subscriptionPlanRelations,
                skip: (page - 1) * limit,
                take: limit,
            }),

            this.prisma.subscriptionPlan.count({
                where,
            }),
        ]);

        return {
            records,
            total,
        };
    }

    findById(id: string, tx?: Prisma.TransactionClient) {
        return this.getClient(tx).subscriptionPlan.findUnique({
            where: {
                id,
            },

            include: this.subscriptionPlanRelations,
        });
    }

    findByName(name: string, excludeId?: string, tx?: Prisma.TransactionClient) {
        return this.getClient(tx).subscriptionPlan.findFirst({
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

    create(data: Prisma.SubscriptionPlanCreateInput, tx?: Prisma.TransactionClient) {
        return this.getClient(tx).subscriptionPlan.create({
            data,

            include: this.subscriptionPlanRelations,
        });
    }

    update(id: string, data: Prisma.SubscriptionPlanUpdateInput, tx?: Prisma.TransactionClient) {
        return this.getClient(tx).subscriptionPlan.update({
            where: {
                id,
            },

            data,

            include: this.subscriptionPlanRelations,
        });
    }

    activate(id: string, tx?: Prisma.TransactionClient) {
        return this.getClient(tx).subscriptionPlan.update({
            where: {
                id,
            },

            data: {
                is_active: true,
            },
        });
    }

    deactivate(id: string, tx?: Prisma.TransactionClient) {
        return this.getClient(tx).subscriptionPlan.update({
            where: {
                id,
            },

            data: {
                is_active: false,
            },
        });
    }
}
