import { Prisma } from '@gen/prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';

@Injectable()
export class UserBranchesRepository {
    constructor(
        private readonly prisma: PrismaService,
    ) {}

    private getClient(tx?: Prisma.TransactionClient) {
        return tx ?? this.prisma;
    }

    async create(
        data: Prisma.UserBranchUncheckedCreateInput,
        tx?: Prisma.TransactionClient,
    ) {

        return this.getClient(tx).userBranch.create({
            data,
        });
    }

    countByBranchId(
        branchId: string,
        tx?: Prisma.TransactionClient,
    ) {
        return this.getClient(tx).userBranch.count({
            where: {
                branch_id: branchId,
            },
        });
    }
}