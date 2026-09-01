import { Injectable } from '@nestjs/common';
import { Prisma } from '@gen/prisma/client';
import { PrismaService } from '@/database/prisma/prisma.service';

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

    findMany(pharmacyId: string, tx?: Prisma.TransactionClient) {
        return this.getClient(tx).pharmacyPaymentMethod.findMany({
            where: {
                pharmacy_id: pharmacyId,
            },
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
