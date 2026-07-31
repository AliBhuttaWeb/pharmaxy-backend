import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import { MESSAGES } from '../constants';
import { CreateProductTypeDto, ProductTypeQueryDto, UpdateProductTypeDto } from '../dtos';
import { ProductTypesRepository } from '../repositories/product-types.repository';

@Injectable()
export class ProductTypesService {
    constructor(private readonly productTypeRepository: ProductTypesRepository) {}

    findMany(query: ProductTypeQueryDto) {
        return this.productTypeRepository.findMany(query);
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

        // Later:
        // Check if any products are using this product type.
        // If yes, throw ConflictException(MESSAGES.ERROR.IN_USE);

        await this.productTypeRepository.delete(id);
    }
}
