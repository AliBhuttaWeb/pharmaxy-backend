import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/database/prisma/prisma.service';

@Injectable()
export class RolePermissionsRepository {
    constructor(private readonly prisma: PrismaService) {}

    findUserRolePermissions(userId: string) {
        return this.prisma.userRole.findMany({
            where: {
                user_id: userId,
            },
            select: {
                role: {
                    select: {
                        role_permissions: {
                            select: {
                                permission: {
                                    select: {
                                        name: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
    }
}
