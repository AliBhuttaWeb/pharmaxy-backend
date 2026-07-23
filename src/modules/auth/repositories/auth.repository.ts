import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '@/database/prisma/prisma.service';

@Injectable()
export class AuthRepository {
    constructor(private readonly prisma: PrismaService) {}

    private getUserWithPermissionsArgs() {
        return {
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
        } satisfies Prisma.UserDefaultArgs;
    }

    async findUserById(id: string) {
        return this.prisma.user.findUnique({
            where: { id },
            ...this.getUserWithPermissionsArgs(),
        });
    }

    async findUserByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: { email },
            ...this.getUserWithPermissionsArgs(),
        });
    }

    async updateLastLogin(userId: string): Promise<void> {
        await this.prisma.user.update({
            where: { id: userId },
            data: { last_login_at: new Date() },
        });
    }
}
