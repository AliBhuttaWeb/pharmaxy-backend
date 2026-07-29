import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import { MESSAGES } from '../constants';
import {
    CreatePharmacyDto,
    FindPharmaciesQueryDto,
    UpdatePharmacyDto,
    UpdatePharmacyStatusDto,
} from '../dtos';
import { PharmaciesRepository } from '../repositories/pharmacies.repository';

@Injectable()
export class PharmaciesService {
    constructor(private readonly pharmaciesRepository: PharmaciesRepository) {}

    async list(query: FindPharmaciesQueryDto) {
        return this.pharmaciesRepository.findMany(query);
    }

    async get(id: string) {
        const pharmacy = await this.pharmaciesRepository.findById(id);

        if (!pharmacy) {
            throw new NotFoundException(MESSAGES.ERROR.NOT_FOUND);
        }

        return pharmacy;
    }

    async create(dto: CreatePharmacyDto) {
        const existingPharmacy = await this.pharmaciesRepository.findByName(dto.name);

        if (existingPharmacy) {
            throw new ConflictException(MESSAGES.ERROR.NAME_ALREADY_EXISTS);
        }

        await this.pharmaciesRepository.create(dto);

        return {
            message: MESSAGES.SUCCESS.CREATED,
        };
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

        await this.pharmaciesRepository.update(id, dto);

        return {
            message: MESSAGES.SUCCESS.UPDATED,
        };
    }

    async updateStatus(id: string, dto: UpdatePharmacyStatusDto) {
        const pharmacy = await this.pharmaciesRepository.findById(id);

        if (!pharmacy) {
            throw new NotFoundException(MESSAGES.ERROR.NOT_FOUND);
        }

        await this.pharmaciesRepository.updateStatus(id, dto.status);

        return {
            message: MESSAGES.SUCCESS.UPDATED,
        };
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
