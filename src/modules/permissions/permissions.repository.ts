import { Injectable } from '@nestjs/common';
import { PermissionEffect, Prisma, UserPermission } from '@prisma/client';

import { PrismaService } from '@/database/prisma/prisma.service';

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
}
