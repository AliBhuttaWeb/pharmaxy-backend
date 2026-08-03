import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import { MESSAGES } from '../constants';
import { CreateDosageFormDto, DosageFormQueryDto, UpdateDosageFormDto } from '../dtos';
import { DosageFormsRepository } from '../repositories/dosage-forms.repository';

@Injectable()
export class DosageFormsService {
    constructor(private readonly dosageFormRepository: DosageFormsRepository) {}

    findMany(query: DosageFormQueryDto) {
        return this.dosageFormRepository.findMany(query);
    }

    async findById(id: string) {
        const dosageForm = await this.dosageFormRepository.findById(id);

        if (!dosageForm) {
            throw new NotFoundException(MESSAGES.ERROR.NOT_FOUND);
        }

        return dosageForm;
    }

    async create(dto: CreateDosageFormDto) {
        const existingDosageForm = await this.dosageFormRepository.findByName(dto.name);

        if (existingDosageForm) {
            throw new ConflictException(MESSAGES.ERROR.ALREADY_EXISTS);
        }

        return this.dosageFormRepository.create(dto);
    }

    async update(id: string, dto: UpdateDosageFormDto) {
        await this.findById(id);

        if (dto.name) {
            const existingDosageForm = await this.dosageFormRepository.findByName(dto.name, id);

            if (existingDosageForm) {
                throw new ConflictException(MESSAGES.ERROR.ALREADY_EXISTS);
            }
        }

        return this.dosageFormRepository.update(id, dto);
    }

    async delete(id: string) {
        await this.findById(id);

        // Prevent deletion if products reference this dosage form.
        // Example:
        //
        // const isInUse = await this.productRepository.existsByDosageForm(id);
        //
        // if (isInUse) {
        //     throw new ConflictException(MESSAGES.ERROR.IN_USE);
        // }

        await this.dosageFormRepository.delete(id);
    }
}
