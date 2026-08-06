import { Injectable } from '@nestjs/common';
import { PermissionEffect } from '@prisma/client';

import { PrismaService } from '@/database/prisma/prisma.service';

@Injectable()
export class PermissionResolverService {
    constructor(private readonly prisma: PrismaService) {}

    async getUserPermissions(userId: string): Promise<Set<string>> {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
            include: {
                user_roles: {
                    include: {
                        role: {
                            include: {
                                role_permissions: {
                                    include: {
                                        permission: true,
                                    },
                                },
                            },
                        },
                    },
                },
                user_permissions: {
                    include: {
                        permission: true,
                    },
                },
            },
        });

        if (!user) {
            return new Set();
        }

        const permissions = new Set<string>();

        // Role permissions
        for (const userRole of user.user_roles) {
            for (const rolePermission of userRole.role.role_permissions) {
                permissions.add(rolePermission.permission.name);
            }
        }

        // User overrides
        for (const override of user.user_permissions) {
            if (override.effect === PermissionEffect.ALLOW) {
                permissions.add(override.permission.name);
            } else {
                permissions.delete(override.permission.name);
            }
        }

        return permissions;
    }

    async hasPermission(userId: string, permission: string): Promise<boolean> {
        const permissions = await this.getUserPermissions(userId);

        return permissions.has(permission);
    }

    async hasPermissions(userId: string, requiredPermissions: string[]): Promise<boolean> {
        const permissions = await this.getUserPermissions(userId);

        return requiredPermissions.every((permission) => permissions.has(permission));
    }
}
