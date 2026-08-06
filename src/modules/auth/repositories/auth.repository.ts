import { Injectable } from '@nestjs/common';

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

    async findSignupRole(roleId: string) {
        return this.prisma.role.findUnique({
            where: {
                id: roleId,
            },
            select: {
                id: true,
                name: true,
            },
        });
    }

    async createSignupAccount(data: {
        first_name: string;
        last_name?: string;
        email: string;
        phone?: string;
        password: string;
        role_id: string;
    }) {
        return this.prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    first_name: data.first_name,
                    last_name: data.last_name,
                    email: data.email,
                    phone: data.phone,
                    password: data.password,
                },
            });

            await tx.userRole.create({
                data: {
                    user_id: user.id,
                    role_id: data.role_id,
                },
            });

            return tx.user.findUniqueOrThrow({
                where: {
                    id: user.id,
                },
                ...userWithPermissionsQuery,
            });
        });
    }

    async findUserByPhone(phone: string) {
        return this.prisma.user.findUnique({
            where: {
                phone,
            },
            ...userWithPermissionsQuery,
        });
    }
}
