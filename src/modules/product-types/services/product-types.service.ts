import { ConflictException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';

import { MESSAGES } from '../constants';
import { CreateProductTypeDto, ProductTypeQueryDto, UpdateProductTypeDto } from '../dtos';
import { ProductTypesRepository } from '../repositories/product-types.repository';
import { ProductsService } from '@/modules/products/services/products.service';
import { buildPaginationMeta } from '@/common/pagination';

@Injectable()
export class ProductTypesService {
    constructor(
        private readonly productTypeRepository: ProductTypesRepository,
        @Inject(forwardRef(() => ProductsService))
        private readonly productsService: ProductsService,
    ) {}

    async findMany(query: ProductTypeQueryDto) {
        const { limit, page } = query;
        const { records, total } = await this.productTypeRepository.findMany(query);
        if (!total || !page || !limit) return { records };
        const pagination = buildPaginationMeta({ currentPage: page, limit, totalRecords: total });
        return { records, pagination };
    }

    async findById(id: string) {
        const productType = await this.productTypeRepository.findById(id);

        if (!productType) {
            throw new NotFoundException(MESSAGES.ERROR.NOT_FOUND);
        }

        return productType;
    }

    async create(dto: CreateProductTypeDto) {
        const existingProductType = await this.productTypeRepository.findByName(dto.name);

        if (existingProductType) {
            throw new ConflictException(MESSAGES.ERROR.ALREADY_EXISTS);
        }

        return this.productTypeRepository.create(dto);
    }

    async update(id: string, dto: UpdateProductTypeDto) {
        await this.findById(id);

        if (dto.name) {
            const existingProductType = await this.productTypeRepository.findByName(dto.name, id);

            if (existingProductType) {
                throw new ConflictException(MESSAGES.ERROR.ALREADY_EXISTS);
            }
        }

        return this.productTypeRepository.update(id, dto);
    }

    async delete(id: string) {
        await this.findById(id);

        const isInUse = await this.productsService.existsByProductType(id);
        if (isInUse) {
            throw new ConflictException(MESSAGES.ERROR.IN_USE);
        }

        await this.productTypeRepository.delete(id);

        return { message: MESSAGES.SUCCESS.DELETED };
    }
}
