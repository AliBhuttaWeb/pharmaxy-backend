import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '@/database/prisma/prisma.service';
import { userWithPermissionsQuery } from '../queries';

@Injectable()
export class AuthRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findUserById(id: string) {
        return this.prisma.user.findUnique({
            where: { id },
            ...userWithPermissionsQuery,
        });
    }

    async findUserByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: { email },
            ...userWithPermissionsQuery,
        });
    }

    async updateLastLogin(userId: string): Promise<void> {
        await this.prisma.user.update({
            where: { id: userId },
            data: { last_login_at: new Date() },
        });
    }
}
