import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import { CreateRetailCategoryDto, RetailCategoryQueryDto, UpdateRetailCategoryDto } from '../dtos';
import { MESSAGES } from '../constants';
import { RetailCategoriesRepository } from '../repositories/retail-categories.repository';

@Injectable()
export class RetailCategoriesService {
    constructor(private readonly retailCategoryRepository: RetailCategoriesRepository) {}

    findMany(query: RetailCategoryQueryDto) {
        return this.retailCategoryRepository.findMany(query);
    }

    async findById(id: string) {
        const retailCategory = await this.retailCategoryRepository.findById(id);

        if (!retailCategory) {
            throw new NotFoundException(MESSAGES.ERROR.NOT_FOUND);
        }

        return retailCategory;
    }

    async create(dto: CreateRetailCategoryDto) {
        const existingRetailCategory = await this.retailCategoryRepository.findByName(dto.name);

        if (existingRetailCategory) {
            throw new ConflictException(MESSAGES.ERROR.ALREADY_EXISTS);
        }

        return this.retailCategoryRepository.create(dto);
    }

    async update(id: string, dto: UpdateRetailCategoryDto) {
        await this.findById(id);

        if (dto.name) {
            const existingRetailCategory = await this.retailCategoryRepository.findByName(
                dto.name,
                id,
            );

            if (existingRetailCategory) {
                throw new ConflictException(MESSAGES.ERROR.ALREADY_EXISTS);
            }
        }

        return this.retailCategoryRepository.update(id, dto);
    }

    async delete(id: string) {
        await this.findById(id);

        await this.retailCategoryRepository.delete(id);
    }
}
