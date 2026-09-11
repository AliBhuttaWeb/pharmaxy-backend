import { ConflictException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';

import { MESSAGES } from '../constants';
import { CreateDosageFormDto, DosageFormQueryDto, UpdateDosageFormDto } from '../dtos';
import { DosageFormsRepository } from '../repositories/dosage-forms.repository';
import { ProductsService } from '@/modules/products/services/products.service';
import { buildPaginationMeta } from '@/common/pagination';

@Injectable()
export class DosageFormsService {
    constructor(
        private readonly dosageFormRepository: DosageFormsRepository,
        @Inject(forwardRef(() => ProductsService))
        private readonly productsService: ProductsService,
    ) {}

    async findMany(query: DosageFormQueryDto) {
        const { limit, page } = query;
        const { records, total } = await this.dosageFormRepository.findMany(query);
        if (!total || !page || !limit) return { records };
        const pagination = buildPaginationMeta({ currentPage: page, limit, totalRecords: total });
        return { records, pagination };
    }

    async findById(id: string) {
        const dosageForm = await this.dosageFormRepository.findById(id);

        if (!dosageForm) {
            throw new NotFoundException(MESSAGES.ERROR.NOT_FOUND);
        }

        return { dosageForm };
    }

    async create(dto: CreateDosageFormDto) {
        const existingDosageForm = await this.dosageFormRepository.findByName(dto.name);

        if (existingDosageForm) {
            throw new ConflictException(MESSAGES.ERROR.ALREADY_EXISTS);
        }

        const dosageForm = await this.dosageFormRepository.create(dto);
        return {
            dosageForm,
            message: MESSAGES.SUCCESS.CREATED,
        };
    }

    async update(id: string, dto: UpdateDosageFormDto) {
        await this.findById(id);

        if (dto.name) {
            const existingDosageForm = await this.dosageFormRepository.findByName(dto.name, id);

            if (existingDosageForm) {
                throw new ConflictException(MESSAGES.ERROR.ALREADY_EXISTS);
            }
        }

        const dosageForm = await this.dosageFormRepository.update(id, dto);
        return {
            dosageForm,
            message: MESSAGES.SUCCESS.UPDATED,
        };
    }

    async delete(id: string) {
        await this.findById(id);

        const isInUse = await this.productsService.existsByDosageForm(id);
        if (isInUse) {
            throw new ConflictException(MESSAGES.ERROR.IN_USE);
        }

        await this.dosageFormRepository.delete(id);

        return { message: MESSAGES.SUCCESS.DELETED };
    }
}
