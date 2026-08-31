import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '@/database/prisma/prisma.service';

import { AuthenticatedUser } from '@/modules/auth/types/authenticated-user.type';

import { CreatePharmacyPaymentMethodDto, UpdatePharmacyPaymentMethodDto } from '../dtos';
import { PharmacyPaymentMethodsRepository } from '../repositories/pharmacy-payment-methods.repository';
import { MESSAGES } from '../constants/messages.constants';
import { assertPharmacyAccess } from '@/common/helpers/pharmacy-access.helper';

@Injectable()
export class PharmacyPaymentMethodsService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly pharmacyPaymentMethodsRepository: PharmacyPaymentMethodsRepository,
    ) {}

    async list(pharmacyId: string, user: AuthenticatedUser) {
        assertPharmacyAccess(user, pharmacyId);

        return this.pharmacyPaymentMethodsRepository.findMany(pharmacyId);
    }

    async findById(id: string, pharmacyId: string, user: AuthenticatedUser) {
        assertPharmacyAccess(user, pharmacyId);

        const pharmacyPaymentMethod = await this.pharmacyPaymentMethodsRepository.findById(
            id,
            pharmacyId,
        );

        if (!pharmacyPaymentMethod) {
            throw new NotFoundException(MESSAGES.ERROR.NOT_FOUND);
        }

        return pharmacyPaymentMethod;
    }

    async create(pharmacyId: string, dto: CreatePharmacyPaymentMethodDto, user: AuthenticatedUser) {
        assertPharmacyAccess(user, pharmacyId);

        const paymentMethod = await this.prismaService.paymentMethod.findUnique({
            where: {
                id: dto.payment_method_id,
            },
        });

        if (!paymentMethod) {
            throw new NotFoundException(MESSAGES.ERROR.NOT_FOUND);
        }

        if (!paymentMethod.is_active) {
            throw new ConflictException(MESSAGES.ERROR.PAYMENT_METHOD_INACTIVE);
        }

        const existing = await this.pharmacyPaymentMethodsRepository.findByPaymentMethodId(
            pharmacyId,
            dto.payment_method_id,
        );

        if (existing) {
            throw new ConflictException(MESSAGES.ERROR.ALREADY_CONFIGURED);
        }

        return this.pharmacyPaymentMethodsRepository.create({
            pharmacy_id: pharmacyId,
            payment_method_id: dto.payment_method_id,
        });
    }

    async update(
        id: string,
        pharmacyId: string,
        dto: UpdatePharmacyPaymentMethodDto,
        user: AuthenticatedUser,
    ) {
        await this.findById(id, pharmacyId, user);

        return this.pharmacyPaymentMethodsRepository.update(id, pharmacyId, {
            display_order: dto.display_order,
        });
    }

    async updateStatus(id: string, pharmacyId: string, isActive: boolean, user: AuthenticatedUser) {
        await this.findById(id, pharmacyId, user);

        return this.pharmacyPaymentMethodsRepository.updateStatus(id, pharmacyId, isActive);
    }

    async remove(id: string, pharmacyId: string, user: AuthenticatedUser) {
        await this.findById(id, pharmacyId, user);

        return this.pharmacyPaymentMethodsRepository.delete(id);
    }
}
