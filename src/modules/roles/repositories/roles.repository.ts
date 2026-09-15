import { Injectable } from '@nestjs/common';

import { Prisma } from '@gen/prisma/client';

import { PrismaService } from '@/database/prisma/prisma.service';
import { FindRolesQueryDto, UpdateRolePermissionsDto } from '../dtos';

@Injectable()
export class RolesRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findMany(query?: FindRolesQueryDto, allowedRoleIds?: string[]) {
        const {
            page,
            limit,
            search,
            signup_scope,
            parent_role_id,
            sort_by = 'name',
            sort_order = 'asc',
        } = query ?? {};

        const where: Prisma.RoleWhereInput = {};

        if (allowedRoleIds !== undefined) {
            where.id = { in: allowedRoleIds };
        }

        if (parent_role_id) {
            where.parent_id = parent_role_id;
        }

        if (signup_scope) {
            where.signup_scope = signup_scope;
        }

        if (search) {
            const searchFilter: Prisma.RoleWhereInput = {
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
            };

            where.AND = [searchFilter];
        }

        const isPaginated = page !== undefined && limit !== undefined;

        const records = await this.prisma.role.findMany({
            where,
            orderBy: {
                [sort_by]: sort_order,
            },
            ...(isPaginated
                ? {
                      skip: (page - 1) * limit,
                      take: limit,
                  }
                : {}),
        });

        if (!isPaginated) {
            return { records };
        }

        const total = await this.prisma.role.count({
            where,
        });

        return {
            records,
            total,
        };
    }

    findById(id: string) {
        return this.prisma.role.findUnique({
            where: {
                id,
            },
        });
    }

    findByName(name: string) {
        return this.prisma.role.findUnique({
            where: {
                name,
            },
        });
    }

    findByIdWithPermissions(id: string) {
        return this.prisma.role.findUnique({
            where: {
                id,
            },

            include: {
                role_permissions: {
                    include: {
                        permission: true,
                    },
                },
            },
        });
    }

    replacePermissions(roleId: string, permissionIds: string[]) {
        return this.prisma.role.update({
            where: {
                id: roleId,
            },

            data: {
                role_permissions: {
                    deleteMany: {},

                    createMany: {
                        data: permissionIds.map((permissionId) => ({
                            permission_id: permissionId,
                        })),
                    },
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
    }

    async findRoleAndDescendantsWithPermissions(id: string) {
        const role = await this.findByIdWithPermissions(id);

        if (!role) {
            return null;
        }

        const childRoles: Array<
            NonNullable<Awaited<ReturnType<typeof this.findByIdWithPermissions>>>
        > = [];
        const visitedIds = new Set<string>([id]);
        let currentParentIds = [id];

        while (currentParentIds.length > 0) {
            const children = await this.prisma.role.findMany({
                where: {
                    parent_id: { in: currentParentIds },
                },
                include: {
                    role_permissions: {
                        include: {
                            permission: true,
                        },
                    },
                },
            });

            if (children.length === 0) {
                break;
            }

            const unvisitedChildren = children.filter((child) => !visitedIds.has(child.id));
            if (unvisitedChildren.length === 0) {
                break;
            }

            for (const child of unvisitedChildren) {
                visitedIds.add(child.id);
            }

            childRoles.push(...unvisitedChildren);
            currentParentIds = unvisitedChildren.map((c) => c.id);
        }

        return {
            role,
            children: childRoles,
        };
    }

    async isChildRole(
        parentRoleIds: string[],
        targetRole: { id: string; parent_id?: string | null },
    ): Promise<boolean> {
        if (!parentRoleIds.length || !targetRole) {
            return false;
        }

        let effectiveRoleIds = parentRoleIds;
        const userRoles = await this.prisma.userRole.findMany({
            where: { id: { in: parentRoleIds } },
            select: { role_id: true },
        });
        if (userRoles.length > 0) {
            effectiveRoleIds = [
                ...new Set([...parentRoleIds, ...userRoles.map((ur) => ur.role_id)]),
            ];
        }

        // A role cannot be a child of itself
        if (effectiveRoleIds.includes(targetRole.id)) {
            return false;
        }

        // Fast-path: if direct parent matches, return true immediately
        if (targetRole.parent_id && effectiveRoleIds.includes(targetRole.parent_id)) {
            return true;
        }

        // If target role has no parent_id, it is a root role (e.g. Super Admin) and cannot be a child
        if (!targetRole.parent_id) {
            return false;
        }

        // Single lightweight query to load role parent mappings
        const roles = await this.prisma.role.findMany({
            select: { id: true, parent_id: true },
        });

        const parentMap = new Map<string, string | null>();
        for (const role of roles) {
            parentMap.set(role.id, role.parent_id);
        }

        // Traverse upwards through ancestors in memory
        const visited = new Set<string>([targetRole.id]);
        let currentParentId: string | null = targetRole.parent_id;

        while (currentParentId && !visited.has(currentParentId)) {
            if (effectiveRoleIds.includes(currentParentId)) {
                return true;
            }
            visited.add(currentParentId);
            currentParentId = parentMap.get(currentParentId) ?? null;
        }

        return false;
    }

    async findChildRoleIds(parentRoleIds: string[]): Promise<string[]> {
        if (!parentRoleIds.length) {
            return [];
        }

        let effectiveRoleIds = parentRoleIds;
        const userRoles = await this.prisma.userRole.findMany({
            where: { id: { in: parentRoleIds } },
            select: { role_id: true },
        });
        if (userRoles.length > 0) {
            effectiveRoleIds = [
                ...new Set([...parentRoleIds, ...userRoles.map((ur) => ur.role_id)]),
            ];
        }

        // Single lightweight query to load role parent mappings
        const roles = await this.prisma.role.findMany({
            select: { id: true, parent_id: true },
        });

        const childrenMap = new Map<string, string[]>();
        for (const role of roles) {
            if (role.parent_id) {
                const list = childrenMap.get(role.parent_id) ?? [];
                list.push(role.id);
                childrenMap.set(role.parent_id, list);
            }
        }

        const childRoleIds = new Set<string>();
        const queue = [...effectiveRoleIds];

        while (queue.length > 0) {
            const currentId = queue.shift()!;
            const children = childrenMap.get(currentId);
            if (children) {
                for (const childId of children) {
                    if (!childRoleIds.has(childId) && !parentRoleIds.includes(childId)) {
                        childRoleIds.add(childId);
                        queue.push(childId);
                    }
                }
            }
        }

        return Array.from(childRoleIds);
    }
}


