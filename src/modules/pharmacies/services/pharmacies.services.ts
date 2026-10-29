import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { MESSAGES } from '../constants';
import {
    CreatePharmacyDto,
    FindPharmaciesQueryDto,
    UpdatePharmacyDto,
    UpdatePharmacyStatusDto,
} from '../dtos';
import { PharmaciesRepository } from '../repositories/pharmacies.repository';
import { UsersRepository } from '@/modules/users/repositories/users.repository';
import { PharmacyPaymentMethodsService } from '@/modules/pharmacy-payment-methods/services/pharmacy-payment-methods.service';
import { PrismaService } from '@/database/prisma/prisma.service';
import { AuthenticatedUser } from '@/modules/auth/types';
import { buildPaginationMeta } from '@/common/pagination';
import { ensurePharmacyAccess, getActivePharmacyId, isSuperAdmin } from '@/common/helpers';

@Injectable()
export class PharmaciesService {
    constructor(
        private readonly pharmaciesRepository: PharmaciesRepository,
        private readonly usersRepository: UsersRepository,
        private readonly prismaService: PrismaService,
        private readonly pharmacyPaymentMethodsService: PharmacyPaymentMethodsService,
    ) {}

    private mapPharmacyWithSubscription(pharmacy: any) {
        if (!pharmacy) return pharmacy;
        const { subscriptions, ...rest } = pharmacy;
        return {
            ...rest,
            current_subscription: subscriptions?.[0] ?? null,
        };
    }

    async list(query: FindPharmaciesQueryDto, user: AuthenticatedUser) {
        const targetPharmacyId = isSuperAdmin(user.roles)
            ? query.pharmacy_id
            : getActivePharmacyId(user);

        const { page, limit } = query;
        const { records, total } = await this.pharmaciesRepository.findMany(query, targetPharmacyId);
        const mappedRecords = (records || []).map((pharmacy) => this.mapPharmacyWithSubscription(pharmacy));

        if (!total || !page || !limit) return { records: mappedRecords };
        const pagination = buildPaginationMeta({ currentPage: page, limit, totalRecords: total });
        return { records: mappedRecords, pagination };
    }

    async get(id: string, user: AuthenticatedUser) {
        ensurePharmacyAccess(id, user);

        const pharmacy = await this.pharmaciesRepository.findById(id);

        if (!pharmacy) {
            throw new NotFoundException(MESSAGES.ERROR.NOT_FOUND);
        }

        return { pharmacy: this.mapPharmacyWithSubscription(pharmacy) };
    }

    async create(dto: CreatePharmacyDto, user: AuthenticatedUser) {
        if (user.pharmacy_id) {
            throw new ConflictException(MESSAGES.ERROR.PHARMACY_ALREADY_EXISTS);
        }

        const existingPharmacy = await this.pharmaciesRepository.findByName(dto.name);

        if (existingPharmacy) {
            throw new ConflictException(MESSAGES.ERROR.NAME_ALREADY_EXISTS);
        }

        return this.prismaService.transaction(async (tx) => {
            const pharmacy = await this.pharmaciesRepository.create(dto, tx);

            await this.usersRepository.updatePharmacy(user.id, pharmacy.id, tx);

            await this.pharmacyPaymentMethodsService.attachCashPaymentMethod(pharmacy.id, tx);

            return { pharmacy, message: MESSAGES.SUCCESS.CREATED };
        });
    }

    async update(id: string, dto: UpdatePharmacyDto, user: AuthenticatedUser) {
        ensurePharmacyAccess(id, user);

        const pharmacy = await this.pharmaciesRepository.findById(id);

        if (!pharmacy) {
            throw new NotFoundException(MESSAGES.ERROR.NOT_FOUND);
        }

        if (dto.name && dto.name !== pharmacy.name) {
            const existingPharmacy = await this.pharmaciesRepository.findByName(dto.name);

            if (existingPharmacy && existingPharmacy.id !== id) {
                throw new ConflictException(MESSAGES.ERROR.NAME_ALREADY_EXISTS);
            }
        }

        const updatedPharmacy = await this.pharmaciesRepository.update(id, dto);
        return { pharmacy: updatedPharmacy, message: MESSAGES.SUCCESS.UPDATED };
    }

    async updateStatus(id: string, dto: UpdatePharmacyStatusDto, user: AuthenticatedUser) {
        ensurePharmacyAccess(id, user);

        const pharmacy = await this.pharmaciesRepository.findById(id);

        if (!pharmacy) {
            throw new NotFoundException(MESSAGES.ERROR.NOT_FOUND);
        }

        const updatedPharmacy = await this.pharmaciesRepository.updateStatus(id, dto.status);

        return { pharmacy: updatedPharmacy, message: MESSAGES.SUCCESS.STATUS_UPDATED };
    }

    async delete(id: string, user: AuthenticatedUser) {
        ensurePharmacyAccess(id, user);

        const pharmacy = await this.pharmaciesRepository.findById(id);

        if (!pharmacy) {
            throw new NotFoundException(MESSAGES.ERROR.NOT_FOUND);
        }

        await this.pharmaciesRepository.delete(id);

        return {
            message: MESSAGES.SUCCESS.DELETED,
        };
    }

    async restore(id: string, user: AuthenticatedUser) {
        ensurePharmacyAccess(id, user);

        const pharmacy = await this.pharmaciesRepository.findByIdIncludingDeleted(id);

        if (!pharmacy) {
            throw new NotFoundException(MESSAGES.ERROR.NOT_FOUND);
        }

        if (!pharmacy.deleted_at) {
            throw new BadRequestException(MESSAGES.ERROR.ALREADY_ACTIVE);
        }

        const restoredPharmacy = await this.pharmaciesRepository.restore(id);
        return { pharmacy: restoredPharmacy, message: MESSAGES.SUCCESS.RESTORED };
    }

    async listDeleted(query: FindPharmaciesQueryDto, user: AuthenticatedUser) {
        const targetPharmacyId = isSuperAdmin(user.roles)
            ? query.pharmacy_id
            : getActivePharmacyId(user);

        const { page, limit } = query;
        const { records, total } = await this.pharmaciesRepository.findDeleted(
            query,
            targetPharmacyId,
        );
        const mappedRecords = (records || []).map((pharmacy) => this.mapPharmacyWithSubscription(pharmacy));

        if (!total || !page || !limit) return { records: mappedRecords };
        const pagination = buildPaginationMeta({ currentPage: page, limit, totalRecords: total });
        return { records: mappedRecords, pagination };
    }
}

