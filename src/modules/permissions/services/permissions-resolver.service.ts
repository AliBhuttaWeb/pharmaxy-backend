import { Injectable } from '@nestjs/common';
import { PermissionEffect } from '@prisma/client';

import { PrismaService } from '@/database/prisma/prisma.service';
import { ROLE_HIERARCHY } from '@/modules/roles/policies/role-hierarchy.policy';

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

        const roleNames = new Set<string>();

        for (const userRole of user.user_roles) {
            for (const role of this.resolveRoleHierarchy(userRole.role.name)) {
                roleNames.add(role);
            }
        }

        const roles = await this.prisma.role.findMany({
            where: {
                name: {
                    in: [...roleNames],
                },
            },

            include: {
                role_permissions: {
                    include: {
                        permission: true,
                    },
                },
            },
        });

        const permissions = new Set<string>();

        for (const role of roles) {
            for (const rolePermission of role.role_permissions) {
                permissions.add(rolePermission.permission.name);
            }
        }

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

    private resolveRoleHierarchy(roleName: string): string[] {
        const roles = new Set<string>();

        const visit = (role: string) => {
            if (roles.has(role)) {
                return;
            }

            roles.add(role);

            for (const child of ROLE_HIERARCHY[role] ?? []) {
                visit(child);
            }
        };

        visit(roleName);

        return [...roles];
    }
}
