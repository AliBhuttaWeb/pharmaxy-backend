import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import { AuthenticatedUser } from '@/modules/auth/types/authenticated-user.type';
import { getActivePharmacyId } from '@/common/helpers/auth.helper';

import { CreatePharmacyPaymentMethodDto, UpdatePharmacyPaymentMethodDto } from '../dtos';
import { PharmacyPaymentMethodsRepository } from '../repositories/pharmacy-payment-methods.repository';
import { PaymentMethodsRepository } from '@/modules/payment-methods/repositories/payment-methods.repository';
import { MESSAGES } from '../constants/messages.constants';

@Injectable()
export class PharmacyPaymentMethodsService {
    constructor(
        private readonly pharmacyPaymentMethodsRepository: PharmacyPaymentMethodsRepository,
        private readonly paymentMethodsRepository: PaymentMethodsRepository,
    ) {}

    async list(user: AuthenticatedUser) {
        const pharmacyId = getActivePharmacyId(user);

        return this.pharmacyPaymentMethodsRepository.findMany(pharmacyId);
    }

    async findById(id: string, user: AuthenticatedUser) {
        const pharmacyId = getActivePharmacyId(user);

        const pharmacyPaymentMethod = await this.pharmacyPaymentMethodsRepository.findById(
            id,
            pharmacyId,
        );

        if (!pharmacyPaymentMethod) {
            throw new NotFoundException(MESSAGES.ERROR.NOT_FOUND);
        }

        return pharmacyPaymentMethod;
    }

    async create(dto: CreatePharmacyPaymentMethodDto, user: AuthenticatedUser) {
        const pharmacyId = getActivePharmacyId(user);

        const paymentMethod = await this.paymentMethodsRepository.findById(dto.payment_method_id);

        if (!paymentMethod) {
            throw new NotFoundException(MESSAGES.ERROR.PAYMENT_METHOD_NOT_FOUND);
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
        dto: UpdatePharmacyPaymentMethodDto,
        user: AuthenticatedUser,
    ) {
        const pharmacyId = getActivePharmacyId(user);
        await this.findById(id, user);

        return this.pharmacyPaymentMethodsRepository.update(id, pharmacyId, {
            display_order: dto.display_order,
        });
    }

    async updateStatus(id: string, isActive: boolean, user: AuthenticatedUser) {
        const pharmacyId = getActivePharmacyId(user);
        await this.findById(id, user);

        return this.pharmacyPaymentMethodsRepository.updateStatus(id, pharmacyId, isActive);
    }

    async remove(id: string, user: AuthenticatedUser) {
        await this.findById(id, user);

        return this.pharmacyPaymentMethodsRepository.delete(id);
    }
}
