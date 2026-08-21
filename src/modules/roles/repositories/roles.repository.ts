import { Injectable } from '@nestjs/common';

import { Prisma } from '@gen/prisma/client';

import { PrismaService } from '@/database/prisma/prisma.service';
import { FindRolesQueryDto, UpdateRolePermissionsDto } from '../dtos';

@Injectable()
export class RolesRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findMany(query?: FindRolesQueryDto) {
        const {
            page,
            limit,
            search,
            signup_scope,
            sort_by = 'name',
            sort_order = 'asc',
        } = query ?? {};

        const where: Prisma.RoleWhereInput = {};

        if (signup_scope) { where.name = signup_scope }

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

        const totalRecords = await this.prisma.role.count({
            where,
        });

        return {
            records,
            totalRecords,
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
}
