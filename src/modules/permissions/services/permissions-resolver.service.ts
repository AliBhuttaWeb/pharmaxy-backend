import { Injectable } from '@nestjs/common';

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
            },
        });

        if (!user) {
            return new Set();
        }

        const permissions = new Set<string>();

        for (const userRole of user.user_roles) {
            const roles = this.resolveRoleHierarchy(userRole.role.name);

            for (const role of roles) {
                const rolePermissions = await this.getRolePermissions(role);

                for (const permission of rolePermissions) {
                    permissions.add(permission);
                }
            }
        }

        return permissions;
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

        return Array.from(roles);
    }

    private async getRolePermissions(roleName: string): Promise<string[]> {
        const role = await this.prisma.role.findUnique({
            where: {
                name: roleName,
            },

            include: {
                role_permissions: {
                    include: {
                        permission: true,
                    },
                },
            },
        });

        if (!role) {
            return [];
        }

        return role.role_permissions.map(({ permission }) => permission.name);
    }
}
