import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { MESSAGES } from '../constants';
import {
    CreateCategoryDto,
    FindCategoriesQueryDto,
    UpdateCategoryDto,
} from '../dtos';
import { CategoriesRepository } from '../repositories/categories.repository';

@Injectable()
export class CategoriesService {
    constructor(
        private readonly categoriesRepository: CategoriesRepository,
    ) {}

    async list(
        query: FindCategoriesQueryDto,
    ) {
        return this.categoriesRepository.findMany(
            query,
        );
    }

    async get(id: string) {
        const category =
            await this.categoriesRepository.findById(
                id,
            );

        if (!category) {
            throw new NotFoundException(
                MESSAGES.ERROR.NOT_FOUND,
            );
        }

        return category;
    }

    async create(
        dto: CreateCategoryDto,
    ) {
        const existingCategory =
            await this.categoriesRepository.findFirst({
                name: dto.name,
            });

        if (existingCategory) {
            throw new ConflictException(
                MESSAGES.ERROR.NAME_ALREADY_EXISTS,
            );
        }

        if (dto.parent_id) {
            const parent =
                await this.categoriesRepository.findById(
                    dto.parent_id,
                );

            if (!parent) {
                throw new NotFoundException(
                    MESSAGES.ERROR.PARENT_NOT_FOUND,
                );
            }
        }

        await this.categoriesRepository.create(dto);

        return {
            message: MESSAGES.SUCCESS.CREATED,
        };
    }

    async update(
        id: string,
        dto: UpdateCategoryDto,
    ) {
        const category =
            await this.categoriesRepository.findById(
                id,
            );

        if (!category) {
            throw new NotFoundException(
                MESSAGES.ERROR.NOT_FOUND,
            );
        }

        if (
            dto.name &&
            dto.name !== category.name
        ) {
            const existingCategory =
                await this.categoriesRepository.findFirst(
                    {
                        name: dto.name,
                    },
                );

            if (
                existingCategory &&
                existingCategory.id !== id
            ) {
                throw new ConflictException(
                    MESSAGES.ERROR.NAME_ALREADY_EXISTS,
                );
            }
        }

        if (dto.parent_id) {
            if (dto.parent_id === id) {
                throw new ConflictException(
                    MESSAGES.ERROR.INVALID_PARENT,
                );
            }

            const parent =
                await this.categoriesRepository.findById(
                    dto.parent_id,
                );

            if (!parent) {
                throw new NotFoundException(
                    MESSAGES.ERROR.PARENT_NOT_FOUND,
                );
            }
        }

        await this.categoriesRepository.update(
            id,
            dto,
        );

        return {
            message: MESSAGES.SUCCESS.UPDATED,
        };
    }

    async delete(id: string) {
        const category =
            await this.categoriesRepository.findById(
                id,
            );

        if (!category) {
            throw new NotFoundException(
                MESSAGES.ERROR.NOT_FOUND,
            );
        }

        await this.categoriesRepository.delete(id);

        return {
            message: MESSAGES.SUCCESS.DELETED,
        };
    }
}