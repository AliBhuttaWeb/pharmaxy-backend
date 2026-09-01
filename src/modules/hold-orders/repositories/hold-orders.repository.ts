import { Injectable } from '@nestjs/common';
import { Prisma } from '@gen/prisma/client';

import { PrismaService } from '@/database/prisma/prisma.service';

import { HoldOrderQueryDto } from '../dtos';

@Injectable()
export class HoldOrdersRepository {
    constructor(private readonly prisma: PrismaService) {}

    private readonly relations: Prisma.HoldOrderInclude = {
        customer: true,

        cashier: true,

        items: {
            include: {
                branch_product: {
                    include: {
                        product: true,
                    },
                },
            },
        },
    };

    private getClient(tx?: Prisma.TransactionClient) {
        return tx ?? this.prisma;
    }

    private buildWhere(branchId: string): Prisma.HoldOrderWhereInput {
        return {
            branch_id: branchId,
        };
    }

    async findMany(branchId: string, query: HoldOrderQueryDto) {
        const where = this.buildWhere(branchId);

        const { page, limit } = query;

        const orderBy: Prisma.HoldOrderOrderByWithRelationInput = {
            created_at: 'desc',
        };

        const isPaginated = page !== undefined && limit !== undefined;

        if (!isPaginated) {
            const records = await this.prisma.holdOrder.findMany({
                where,
                include: this.relations,
                orderBy,
            });
            return { records };
        }

        const [records, total] = await this.prisma.$transaction([
            this.prisma.holdOrder.findMany({
                where,
                include: this.relations,
                orderBy,
                skip: (page - 1) * limit,
                take: limit,
            }),

            this.prisma.holdOrder.count({
                where,
            }),
        ]);

        return {
            records,
            total,
        };
    }

    findById(id: string, tx?: Prisma.TransactionClient) {
        return this.getClient(tx).holdOrder.findUnique({
            where: {
                id,
            },

            include: this.relations,
        });
    }

    findLatest(branchId: string, tx?: Prisma.TransactionClient) {
        return this.getClient(tx).holdOrder.findFirst({
            where: {
                branch_id: branchId,
            },

            orderBy: {
                created_at: 'desc',
            },

            select: {
                hold_number: true,
            },
        });
    }

    create(data: Prisma.HoldOrderCreateInput, tx?: Prisma.TransactionClient) {
        return this.getClient(tx).holdOrder.create({
            data,
            include: this.relations,
        });
    }

    delete(id: string, tx?: Prisma.TransactionClient) {
        return this.getClient(tx).holdOrder.delete({
            where: {
                id,
            },
        });
    }
}
