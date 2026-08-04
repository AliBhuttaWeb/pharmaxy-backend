import { ConflictException, Injectable } from '@nestjs/common';

import { PrismaService } from '@/database/prisma/prisma.service';

import { AuthenticatedUser } from '@/modules/auth/types';
import { MESSAGES } from '@common/constants';

@Injectable()
export class BranchContextService {
    constructor(private readonly prisma: PrismaService) {}

    async get(user: AuthenticatedUser) {
        if (!user.activeBranchId) {
            throw new ConflictException(MESSAGES.ERROR.NO_ACTIVE_BRANCH);
        }

        const branch = await this.prisma.branch.findUnique({
            where: {
                id: user.activeBranchId,
            },

            select: {
                id: true,
                pharmacy_id: true,
            },
        });

        if (!branch) {
            throw new ConflictException(MESSAGES.ERROR.NO_ACTIVE_BRANCH);
        }

        return {
            branchId: branch.id,

            pharmacyId: branch.pharmacy_id,
        };
    }
}
