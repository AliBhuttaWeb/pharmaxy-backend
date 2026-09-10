import { Injectable } from '@nestjs/common';
import { Prisma } from '@gen/prisma/client';
import { PrismaService } from '@/database/prisma/prisma.service';
import { CreatePaymentMethodDto, PaymentMethodQueryDto, UpdatePaymentMethodDto } from '../dtos';

@Injectable()
export class PaymentMethodsRepository {
    constructor(private readonly prisma: PrismaService) {}

    private readonly paymentMethodRelations: Prisma.PaymentMethodInclude = {
        provider: true,
    };

    private buildWhere(query: PaymentMethodQueryDto): Prisma.PaymentMethodWhereInput {
        const { search, type, is_active } = query;

        return {
            ...(search && {
                OR: [
                    {
                        name: {
                            contains: search,
                            mode: 'insensitive',
                        },
                    },
                    {
                        code: {
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
            }),
            ...(type && {
                type,
            }),
            ...(is_active !== undefined && {
                is_active,
            }),
        };
    }

    private buildOrderBy(
        sortBy?: string,
        sortOrder: Prisma.SortOrder = 'asc',
    ): Prisma.PaymentMethodOrderByWithRelationInput {
        return {
            [(sortBy ?? 'display_order') as keyof Prisma.PaymentMethodOrderByWithRelationInput]:
                sortOrder,
        };
    }

    async findMany(query: PaymentMethodQueryDto, tx?: Prisma.TransactionClient) {
        const { page, limit, sortBy, sortOrder } = query;
        const where = this.buildWhere(query);
        const orderBy = this.buildOrderBy(sortBy, sortOrder);

        const isPaginated = page !== undefined && limit !== undefined;

        if (!isPaginated) {
            const records = await this.prisma.getClient(tx).paymentMethod.findMany({
                where,
                orderBy,
                include: this.paymentMethodRelations,
            });
            return { records };
        }

        const [records, total] = await this.prisma.getClient(tx).$transaction([
            this.prisma.paymentMethod.findMany({
                where,
                orderBy,
                include: this.paymentMethodRelations,
                skip: (page - 1) * limit,
                take: limit,
            }),
            this.prisma.paymentMethod.count({
                where,
            }),
        ]);

        return {
            records,
            total,
        };
    }

    findById(id: string, tx?: Prisma.TransactionClient) {
        return this.prisma.getClient(tx).paymentMethod.findUnique({
            where: {
                id,
            },
            include: this.paymentMethodRelations,
        });
    }

    findByName(name: string, excludeId?: string, tx?: Prisma.TransactionClient) {
        return this.prisma.getClient(tx).paymentMethod.findFirst({
            where: {
                name: {
                    equals: name,
                    mode: 'insensitive',
                },
                ...(excludeId && {
                    NOT: {
                        id: excludeId,
                    },
                }),
            },
        });
    }

    findByCode(code: string, excludeId?: string, tx?: Prisma.TransactionClient) {
        return this.prisma.getClient(tx).paymentMethod.findFirst({
            where: {
                code: {
                    equals: code,
                    mode: 'insensitive',
                },
                ...(excludeId && {
                    NOT: {
                        id: excludeId,
                    },
                }),
            },
        });
    }

    create(data: CreatePaymentMethodDto, tx?: Prisma.TransactionClient) {
        return this.prisma.getClient(tx).paymentMethod.create({
            data,
            include: this.paymentMethodRelations,
        });
    }

    update(id: string, data: UpdatePaymentMethodDto, tx?: Prisma.TransactionClient) {
        return this.prisma.getClient(tx).paymentMethod.update({
            where: {
                id,
            },
            data,
            include: this.paymentMethodRelations,
        });
    }

    delete(id: string, tx?: Prisma.TransactionClient) {
        return this.prisma.getClient(tx).paymentMethod.delete({
            where: {
                id,
            },
        });
    }
}
