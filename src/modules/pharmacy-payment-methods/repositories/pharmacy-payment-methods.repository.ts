import { Injectable } from '@nestjs/common';
import { Prisma } from '@gen/prisma/client';
import { PrismaService } from '@/database/prisma/prisma.service';
import { PharmacyPaymentMethodQueryDto } from '../dtos';

@Injectable()
export class PharmacyPaymentMethodsRepository {
    constructor(private readonly prisma: PrismaService) {}

    private getClient(tx?: Prisma.TransactionClient) {
        return tx ?? this.prisma;
    }

    findByPaymentMethodId(
        pharmacyId: string,
        paymentMethodId: string,
        tx?: Prisma.TransactionClient,
    ) {
        return this.getClient(tx).pharmacyPaymentMethod.findUnique({
            where: {
                pharmacy_id_payment_method_id: {
                    pharmacy_id: pharmacyId,
                    payment_method_id: paymentMethodId,
                },
            },
        });
    }

    async findMany(
        pharmacyId: string,
        query?: PharmacyPaymentMethodQueryDto,
        tx?: Prisma.TransactionClient,
    ) {
        const { page, limit, is_active } = query ?? {};

        const where: Prisma.PharmacyPaymentMethodWhereInput = {
            pharmacy_id: pharmacyId,
            ...(is_active !== undefined && {
                is_active,
            }),
        };

        const isPaginated = page !== undefined && limit !== undefined;

        if (!isPaginated) {
            const records = await this.getClient(tx).pharmacyPaymentMethod.findMany({
                where,
                include: {
                    payment_method: {
                        include: {
                            provider: true,
                        },
                    },
                },
                orderBy: {
                    display_order: 'asc',
                },
            });
            return { records };
        }

        const [records, total] = await this.getClient(tx).$transaction([
            this.prisma.pharmacyPaymentMethod.findMany({
                where,
                include: {
                    payment_method: {
                        include: {
                            provider: true,
                        },
                    },
                },
                orderBy: {
                    display_order: 'asc',
                },
                skip: (page - 1) * limit,
                take: limit,
            }),
            this.prisma.pharmacyPaymentMethod.count({
                where,
            }),
        ]);

        return {
            records,
            total,
        };
    }

    findById(id: string, pharmacyId: string, tx?: Prisma.TransactionClient) {
        return this.getClient(tx).pharmacyPaymentMethod.findFirst({
            where: {
                id,
                pharmacy_id: pharmacyId,
            },
            include: {
                payment_method: {
                    include: {
                        provider: true,
                    },
                },
            },
        });
    }

    create(data: Prisma.PharmacyPaymentMethodUncheckedCreateInput, tx?: Prisma.TransactionClient) {
        return this.getClient(tx).pharmacyPaymentMethod.create({
            data,
            include: {
                payment_method: {
                    include: {
                        provider: true,
                    },
                },
            },
        });
    }

    update(
        id: string,
        pharmacyId: string,
        data: Prisma.PharmacyPaymentMethodUncheckedUpdateInput,
        tx?: Prisma.TransactionClient,
    ) {
        return this.getClient(tx).pharmacyPaymentMethod.update({
            where: {
                id,
            },
            data,
            include: {
                payment_method: {
                    include: {
                        provider: true,
                    },
                },
            },
        });
    }

    updateStatus(id: string, pharmacyId: string, isActive: boolean, tx?: Prisma.TransactionClient) {
        return this.getClient(tx).pharmacyPaymentMethod.updateMany({
            where: {
                id,
                pharmacy_id: pharmacyId,
            },
            data: {
                is_active: isActive,
            },
        });
    }

    delete(id: string, tx?: Prisma.TransactionClient) {
        return this.getClient(tx).pharmacyPaymentMethod.delete({
            where: {
                id,
            },
        });
    }
}
