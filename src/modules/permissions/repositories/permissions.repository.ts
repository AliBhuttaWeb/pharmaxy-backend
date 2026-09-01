import { Injectable } from '@nestjs/common';
import { PermissionEffect, Prisma, UserPermission } from '@gen/prisma/client';

import { PrismaService } from '@/database/prisma/prisma.service';
import { FindPermissionsQueryDto } from '../dtos';

@Injectable()
export class PermissionsRepository {
    constructor(private readonly prisma: PrismaService) {}

    private getClient(tx?: Prisma.TransactionClient) {
        return tx ?? this.prisma;
    }

    async getRolePermissions(
        roleIds: string[],
        tx?: Prisma.TransactionClient,
    ): Promise<Set<string>> {
        if (!roleIds.length) {
            return new Set();
        }

        const rolePermissions = await this.getClient(tx).rolePermission.findMany({
            where: {
                role_id: {
                    in: roleIds,
                },
            },
            select: {
                permission_id: true,
            },
        });

        return new Set(rolePermissions.map(({ permission_id }) => permission_id));
    }

    async getUserPermissionOverrides(
        userId: string,
        tx?: Prisma.TransactionClient,
    ): Promise<Map<string, UserPermission>> {
        const overrides = await this.getClient(tx).userPermission.findMany({
            where: {
                user_id: userId,
            },
        });

        return new Map(overrides.map((override) => [override.permission_id, override]));
    }

    async deletePermissionOverrides(ids: string[], tx?: Prisma.TransactionClient): Promise<void> {
        if (!ids.length) {
            return;
        }

        await this.getClient(tx).userPermission.deleteMany({
            where: {
                id: {
                    in: ids,
                },
            },
        });
    }

    async updatePermissionOverride(
        id: string,
        effect: PermissionEffect,
        tx?: Prisma.TransactionClient,
    ): Promise<void> {
        await this.getClient(tx).userPermission.update({
            where: {
                id,
            },
            data: {
                effect,
            },
        });
    }

    async createPermissionOverride(
        userId: string,
        permissionId: string,
        effect: PermissionEffect,
        tx?: Prisma.TransactionClient,
    ): Promise<void> {
        await this.getClient(tx).userPermission.create({
            data: {
                user_id: userId,
                permission_id: permissionId,
                effect,
            },
        });
    }

    async findMany(query: FindPermissionsQueryDto) {
        const { search, page, limit, sort_by, sort_order } = query;

        const where: Prisma.PermissionWhereInput = {
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

        const orderBy: Prisma.PermissionOrderByWithRelationInput = {
            [(sort_by ?? 'name') as keyof Prisma.PermissionOrderByWithRelationInput]:
                sort_order ?? 'asc',
        };

        const isPaginated = page !== undefined && limit !== undefined;

        if (!isPaginated) {
            const records = await this.prisma.permission.findMany({
                where,
                orderBy,
            });
            return { records };
        }

        const [records, total] = await this.prisma.$transaction([
            this.prisma.permission.findMany({
                where,
                orderBy,
                skip: (page - 1) * limit,
                take: limit,
            }),
            this.prisma.permission.count({
                where,
            }),
        ]);

        return {
            records,
            total,
        };
    }

    findById(id: string) {
        return this.prisma.permission.findUnique({
            where: {
                id,
            },
        });
    }
}
