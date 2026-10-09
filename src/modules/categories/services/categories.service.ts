import {
    ConflictException,
    forwardRef,
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { CreateCategoryDto, CategoryQueryDto, UpdateCategoryDto } from '../dtos';
import { MESSAGES } from '../constants';
import { CategoriesRepository } from '../repositories/categories.repository';
import { ProductsService } from '@/modules/products/services/products.service';
import { buildPaginationMeta } from '@/common/pagination';

@Injectable()
export class CategoriesService {
    constructor(
        private readonly categoriesRepository: CategoriesRepository,
        @Inject(forwardRef(() => ProductsService))
        private readonly productsService: ProductsService,
    ) {}

    async findMany(query: CategoryQueryDto) {
        const { limit, page } = query;
        const { records, total } = await this.categoriesRepository.findMany(query);
        if (!total || !page || !limit) return { records };
        const pagination = buildPaginationMeta({ currentPage: page, limit, totalRecords: total });
        return { records, pagination };
    }

    async findById(id: string) {
        const category = await this.categoriesRepository.findById(id);

        if (!category) {
            throw new NotFoundException(MESSAGES.ERROR.NOT_FOUND);
        }

        return { category };
    }

    async create(dto: CreateCategoryDto) {
        const existingCategory = await this.categoriesRepository.findByName(dto.name);

        if (existingCategory) {
            throw new ConflictException(MESSAGES.ERROR.ALREADY_EXISTS);
        }

        const category = await this.categoriesRepository.create(dto);
        return {
            category,
            message: MESSAGES.SUCCESS.CREATED,
        };
    }

    async update(id: string, dto: UpdateCategoryDto) {
        await this.findById(id);

        if (dto.name) {
            const existingCategory = await this.categoriesRepository.findByName(
                dto.name,
                id,
            );

            if (existingCategory) {
                throw new ConflictException(MESSAGES.ERROR.ALREADY_EXISTS);
            }
        }

        const category = await this.categoriesRepository.update(id, dto);
        return {
            category,
            message: MESSAGES.SUCCESS.UPDATED,
        };
    }

    async delete(id: string) {
        await this.findById(id);

        const isInUse = await this.productsService.existsByCategory(id);
        if (isInUse) {
            throw new ConflictException(MESSAGES.ERROR.IN_USE);
        }

        await this.categoriesRepository.delete(id);

        return { message: MESSAGES.SUCCESS.DELETED };
    }
}
