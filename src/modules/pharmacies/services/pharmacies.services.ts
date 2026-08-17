import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import { MESSAGES } from '../constants';
import {
    CreatePharmacyDto,
    FindPharmaciesQueryDto,
    UpdatePharmacyDto,
    UpdatePharmacyStatusDto,
} from '../dtos';
import { PharmaciesRepository } from '../repositories/pharmacies.repository';
import { UsersRepository } from '@/modules/users/repositories/users.repository';
import { PrismaService } from '@/database/prisma/prisma.service';
import { AuthenticatedUser } from '@/modules/auth/types';
import { buildPaginationMeta } from '@/common/pagination';

@Injectable()
export class PharmaciesService {
    constructor(
        private readonly pharmaciesRepository: PharmaciesRepository,
        private readonly usersRepository: UsersRepository,
        private readonly prismaService: PrismaService,
    ) {}

    async list(query: FindPharmaciesQueryDto) {
        const { page, limit } = query;
        const { records, totalRecords } = await this.pharmaciesRepository.findMany(query);

        if (!totalRecords || !page || !limit) return { records };
        const pagination = buildPaginationMeta({ currentPage: page, limit, totalRecords });
        return { records, pagination };
    }

    async get(id: string) {
        const pharmacy = await this.pharmaciesRepository.findById(id);

        if (!pharmacy) {
            throw new NotFoundException(MESSAGES.ERROR.NOT_FOUND);
        }

        return {pharmacy};
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

            return { pharmacy, message: MESSAGES.SUCCESS.CREATED };
        });
    }

    async update(id: string, dto: UpdatePharmacyDto) {
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
        return { pharmacy: updatedPharmacy, message: MESSAGES.SUCCESS.UPDATED }
    }

    async updateStatus(id: string, dto: UpdatePharmacyStatusDto) {
        const pharmacy = await this.pharmaciesRepository.findById(id);

        if (!pharmacy) {
            throw new NotFoundException(MESSAGES.ERROR.NOT_FOUND);
        }

        const updatedPharmacy = await this.pharmaciesRepository.updateStatus(id, dto.status);

        return { pharmacy: updatedPharmacy, message: MESSAGES.SUCCESS.STATUS_UPDATED }
    }

    async delete(id: string) {
        const pharmacy = await this.pharmaciesRepository.findById(id);

        if (!pharmacy) {
            throw new NotFoundException(MESSAGES.ERROR.NOT_FOUND);
        }

        await this.pharmaciesRepository.delete(id);

        return {
            message: MESSAGES.SUCCESS.DELETED,
        };
    }
}
