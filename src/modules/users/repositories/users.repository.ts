import { Injectable } from '@nestjs/common';

import { Prisma, UserStatus } from '@gen/prisma/client';
import { PrismaService } from '@/database/prisma/prisma.service';

import { FindUsersQueryDto } from '../dtos';

@Injectable()
export class UsersRepository {
    constructor(private readonly prisma: PrismaService) {}

    private getClient(tx?: Prisma.TransactionClient) {
        return tx ?? this.prisma;
    }

    async findMany(query: FindUsersQueryDto) {
        const { search, status, page, limit, sort_by, sort_order } = query;

        const where: Prisma.UserWhereInput = {
            ...(search && {
                OR: [
                    {
                        first_name: {
                            contains: search,
                            mode: 'insensitive',
                        },
                    },
                    {
                        last_name: {
                            contains: search,
                            mode: 'insensitive',
                        },
                    },
                    {
                        email: {
                            contains: search,
                            mode: 'insensitive',
                        },
                    },
                    {
                        phone: {
                            contains: search,
                            mode: 'insensitive',
                        },
                    },
                ],
            }),

            ...(status && {
                status,
            }),
        };

        const sortableFields = [
            'first_name',
            'last_name',
            'email',
            'phone',
            'status',
            'created_at',
            'updated_at',
            'last_login_at',
        ] as const;

        const orderBy: Prisma.UserOrderByWithRelationInput = {
            [sortableFields.includes((sort_by as (typeof sortableFields)[number]) ?? 'created_at')
                ? (sort_by as keyof Prisma.UserOrderByWithRelationInput)
                : 'created_at']: sort_order ?? 'desc',
        };

        const isPaginated = page !== undefined && limit !== undefined;

        if (!isPaginated) {
            return this.prisma.user.findMany({
                where,
                orderBy,
                include: {
                    user_roles: {
                        include: {
                            role: true,
                        },
                    },
                    user_branches: {
                        include: {
                            branch: true,
                        },
                    },
                },
            });
        }

        const [records, total] = await this.prisma.$transaction([
            this.prisma.user.findMany({
                where,
                orderBy,
                skip: (page - 1) * limit,
                take: limit,
                include: {
                    user_roles: {
                        include: {
                            role: true,
                        },
                    },
                    user_branches: {
                        include: {
                            branch: true,
                        },
                    },
                },
            }),
            this.prisma.user.count({
                where,
            }),
        ]);

        return {
            records,
            total,
        };
    }

    findById(id: string, tx?: Prisma.TransactionClient) {
        return this.getClient(tx).user.findUnique({
            where: {
                id,
            },
            include: {
                user_roles: {
                    include: {
                        role: true,
                    },
                },
                user_branches: {
                    include: {
                        branch: true,
                    },
                },
            },
        });
    }

    findByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: {
                email,
            },
        });
    }

    findByPhone(phone: string) {
        return this.prisma.user.findUnique({
            where: {
                phone,
            },
        });
    }

    create(data: Prisma.UserUncheckedCreateInput, tx?: Prisma.TransactionClient,) {
        return this.getClient(tx).user.create({
            data,
            include: {
                user_roles: {
                    include: {
                        role: true,
                    },
                },
                user_branches: {
                    include: {
                        branch: true,
                    },
                },
            },
        });
    }

    update(id: string, data: Prisma.UserUpdateInput) {
        return this.prisma.user.update({
            where: {
                id,
            },
            data,
            include: {
                user_roles: {
                    include: {
                        role: true,
                    },
                },
                user_branches: {
                    include: {
                        branch: true,
                    },
                },
            },
        });
    }

    updateStatus(id: string, status: UserStatus) {
        return this.prisma.user.update({
            where: {
                id,
            },
            data: {
                status,
            },
        });
    }

    delete(id: string) {
        return this.prisma.user.delete({
            where: {
                id,
            },
        });
    }

    countByPharmacyId(pharmacyId: string, tx?: Prisma.TransactionClient) {
        return this.getClient(tx).user.count({
            where: {
                pharmacy_id: pharmacyId,
            },
        });
    }

    async updatePharmacy(userId: string, pharmacyId: string, tx?: Prisma.TransactionClient) {
        return this.getClient(tx).user.update({
            where: {
                id: userId,
            },
            data: {
                pharmacy_id: pharmacyId,
            },
        });
    }
}
