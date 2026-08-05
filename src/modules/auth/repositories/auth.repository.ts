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

    async findPharmacyById(pharmacyId: string) {
        return this.prisma.pharmacy.findUnique({
            where: { id: pharmacyId },
        });
    }

    async findBranchById(branchId: string) {
        return this.prisma.branch.findUnique({
            where: { id: branchId },
        });
    }

    async findAvailableBranchesForUser(userId: string, pharmacyId: string | null) {
        if (!pharmacyId) {
            return [];
        }

        // Return all active branches of the pharmacy that the user has access to
        return this.prisma.branch.findMany({
            where: {
                pharmacy_id: pharmacyId,
                is_active: true,
            },
            orderBy: [
                { is_main: 'desc' },
                { name: 'asc' },
            ],
        });
    }

    async findActiveSubscriptionByPharmacyId(pharmacyId: string) {
        return this.prisma.subscription.findFirst({
            where: {
                pharmacy_id: pharmacyId,
                status: {
                    in: ['ACTIVE', 'TRIAL'],
                },
            },
            include: {
                plan: true,
            },
            orderBy: {
                created_at: 'desc',
            },
        });
    }
}
