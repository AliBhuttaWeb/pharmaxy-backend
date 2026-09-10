import { Prisma } from '@gen/prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';

@Injectable()
export class UserBranchesRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(data: Prisma.UserBranchUncheckedCreateInput, tx?: Prisma.TransactionClient) {
        return this.prisma.getClient(tx).userBranch.create({
            data,
        });
    }

    countByBranchId(branchId: string, tx?: Prisma.TransactionClient) {
        return this.prisma.getClient(tx).userBranch.count({
            where: {
                branch_id: branchId,
            },
        });
    }
}
