import { Injectable } from '@nestjs/common';

import { Prisma } from '@prisma/client';
import { PrismaService } from '@/database/prisma/prisma.service';
import { isNonBranchScopedRole } from '@/common/helpers';
import { Role } from '@/common/types';

import { CreateBranchDto, FindBranchesQueryDto } from '../dtos';

@Injectable()
export class BranchesRepository {
    constructor(private readonly prisma: PrismaService) {}

    private getClient(tx?: Prisma.TransactionClient) {
        return tx ?? this.prisma;
    }

    async findMany(query: FindBranchesQueryDto) {
        const { search, pharmacy_id, is_active, is_main, page, limit, sort_by, sort_order } = query;

        const where: Prisma.BranchWhereInput = {
            ...(search && {
                OR: [
                    {
                        name: {
                            contains: search,
                            mode: 'insensitive',
                        },
                    },
                    {
                        address: {
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
                    {
                        state: {
                            contains: search,
                            mode: 'insensitive',
                        },
                    },
                    {
                        country: {
                            contains: search,
                            mode: 'insensitive',
                        },
                    },
                    {
                        postal_code: {
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
                ],
            }),

            ...(pharmacy_id && {
                pharmacy_id,
            }),

            ...(is_active !== undefined && {
                is_active: is_active === 'true',
            }),

            ...(is_main !== undefined && {
                is_main: is_main === 'true',
            }),

            deleted_at: null,
        };

        const sortableFields = [
            'name',
            'city',
            'country',
            'is_main',
            'is_active',
            'created_at',
            'updated_at',
        ] as const;

        const orderBy: Prisma.BranchOrderByWithRelationInput = {
            [sortableFields.includes((sort_by as (typeof sortableFields)[number]) ?? 'created_at')
                ? (sort_by as keyof Prisma.BranchOrderByWithRelationInput)
                : 'created_at']: sort_order ?? 'desc',
        };

        const isPaginated = page !== undefined && limit !== undefined;

        if (!isPaginated) {
            return this.prisma.branch.findMany({
                where,
                orderBy,
            });
        }

        const [records, total] = await this.prisma.$transaction([
            this.prisma.branch.findMany({
                where,
                orderBy,
                skip: (page - 1) * limit,
                take: limit,
            }),
            this.prisma.branch.count({
                where,
            }),
        ]);

        return {
            records,
            total,
        };
    }

    findById(id: string) {
        return this.prisma.branch.findFirst({
            where: {
                id,
                deleted_at: null,
            },
        });
    }

    findByName(pharmacyId: string, name: string) {
        return this.prisma.branch.findFirst({
            where: {
                pharmacy_id: pharmacyId,
                name,
                deleted_at: null,
            },
        });
    }

    findMainBranch(pharmacyId: string) {
        return this.prisma.branch.findFirst({
            where: {
                pharmacy_id: pharmacyId,
                is_main: true,
                deleted_at: null,
            },
        });
    }

    create(dto: CreateBranchDto) {
        const { pharmacy_id, ...data } = dto;

        return this.prisma.branch.create({
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

    update(id: string, data: Prisma.BranchUpdateInput) {
        return this.prisma.branch.update({
            where: {
                id,
            },
            data,
        });
    }

    updateStatus(id: string, isActive: boolean) {
        return this.prisma.branch.update({
            where: {
                id,
            },
            data: {
                is_active: isActive,
            },
        });
    }

    delete(id: string) {
        return this.prisma.branch.update({
            where: {
                id,
            },
            data: {
                deleted_at: new Date(),
            },
        });
    }

    countByPharmacyId(pharmacyId: string, tx?: Prisma.TransactionClient) {
        return this.getClient(tx).branch.count({
            where: {
                pharmacy_id: pharmacyId,
                deleted_at: null,
            },
        });
    }

    /**
     * RBAC-driven Branch Access Query.
     * Returns accessible active branches based on user role assignments.
     */
    async findAvailableBranchesForUser(
        pharmacyId: string,
        userRoles: { role: { name: string }; branch_id: string | null }[],
    ) {
        const hasNonBranchRole = userRoles.some(({ role }) =>
            isNonBranchScopedRole(role.name as Role),
        );

        if (hasNonBranchRole) {
            return this.prisma.branch.findMany({
                where: {
                    pharmacy_id: pharmacyId,
                    is_active: true,
                    deleted_at: null,
                },
                orderBy: [{ is_main: 'desc' }, { name: 'asc' }],
            });
        }

        const assignedBranchIds = userRoles
            .map((ur) => ur.branch_id)
            .filter((id): id is string => Boolean(id));

        if (assignedBranchIds.length === 0) {
            return [];
        }

        return this.prisma.branch.findMany({
            where: {
                pharmacy_id: pharmacyId,
                id: { in: assignedBranchIds },
                is_active: true,
                deleted_at: null,
            },
            orderBy: [{ is_main: 'desc' }, { name: 'asc' }],
        });
    }

    async findAvailableForUser(userId: string) {
        return this.prisma.branch.findMany({
            where: {
                is_active: true,

                user_roles: {
                    some: {
                        user_id: userId,

                        branch_id: {
                            not: null,
                        },
                    },
                },
            },

            select: {
                id: true,
                name: true,
                address: true,
                is_main: true,
                pharmacy_id: true,
            },

            orderBy: [
                {
                    is_main: 'desc',
                },
                {
                    name: 'asc',
                },
            ],
        });
    }
}
