import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import { MESSAGES } from '../constants';
import { CreateProductDto, ProductQueryDto, UpdateProductDto } from '../dtos';
import { ProductsRepository } from '../repositories/products.repository';
import { ManufacturersRepository } from '@/modules/manufacturers/repositories/manufacturers.repository';
import { ProductTypesRepository } from '@/modules/product-types/repositories/product-types.repository';
import { RetailCategoriesRepository } from '@/modules/retail-categories/repositories/retail-categories.repository';
import { DosageFormsRepository } from '@/modules/dosage-forms/repositories/dosage-forms.repository';

@Injectable()
export class ProductsService {
    constructor(
        private readonly productsRepository: ProductsRepository,

        private readonly manufacturersRepository: ManufacturersRepository,

        private readonly productTypesRepository: ProductTypesRepository,

        private readonly retailCategoriesRepository: RetailCategoriesRepository,

        private readonly dosageFormRepository: DosageFormsRepository,
    ) {}

    findMany(query: ProductQueryDto) {
        return this.productsRepository.findMany(query);
    }

    async findById(id: string) {
        const product = await this.productsRepository.findById(id);

        if (!product) {
            throw new NotFoundException(MESSAGES.ERROR.NOT_FOUND);
        }

        return product;
    }

    async create(dto: CreateProductDto) {
        await this.validateRelations(dto);

        if (dto.barcode) {
            const existingProduct = await this.productsRepository.findByBarcode(dto.barcode);

            if (existingProduct) {
                throw new ConflictException(MESSAGES.ERROR.BARCODE_ALREADY_EXISTS);
            }
        }

        return this.productsRepository.create(dto);
    }

    async update(id: string, dto: UpdateProductDto) {
        await this.findById(id);

        await this.validateRelations(dto);

        if (dto.barcode) {
            const existingProduct = await this.productsRepository.findByBarcode(dto.barcode, id);

            if (existingProduct) {
                throw new ConflictException(MESSAGES.ERROR.BARCODE_ALREADY_EXISTS);
            }
        }

        return this.productsRepository.update(id, dto);
    }

    async delete(id: string) {
        await this.findById(id);

        await this.productsRepository.delete(id);
    }

    private async validateRelations(dto: CreateProductDto | UpdateProductDto) {
        if (dto.manufacturer_id) {
            const manufacturer = await this.manufacturersRepository.findById(dto.manufacturer_id);

            if (!manufacturer) {
                throw new NotFoundException(MESSAGES.ERROR.MANUFACTURER_NOT_FOUND);
            }
        }

        if (dto.product_type_id) {
            const productType = await this.productTypesRepository.findById(dto.product_type_id);

            if (!productType) {
                throw new NotFoundException(MESSAGES.ERROR.PRODUCT_TYPE_NOT_FOUND);
            }
        }

        if (dto.retail_category_id) {
            const retailCategory = await this.retailCategoriesRepository.findById(
                dto.retail_category_id,
            );

            if (!retailCategory) {
                throw new NotFoundException(MESSAGES.ERROR.RETAIL_CATEGORY_NOT_FOUND);
            }
        }

        if (dto.dosage_form_id) {
            const dosageForm = await this.dosageFormRepository.findById(dto.dosage_form_id);

            if (!dosageForm) {
                throw new NotFoundException(MESSAGES.ERROR.DOSAGE_FORM_NOT_FOUND);
            }
        }
    }
}
