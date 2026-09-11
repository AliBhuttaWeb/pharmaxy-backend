import { ConflictException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@gen/prisma/client';

import { MESSAGES } from '../constants';
import { CreateProductDto, ProductQueryDto, UpdateProductDto } from '../dtos';
import { ProductsRepository } from '../repositories/products.repository';
import { ManufacturersService } from '@/modules/manufacturers/services/manufacturer.service';
import { ProductTypesService } from '@/modules/product-types/services/product-types.service';
import { RetailCategoriesService } from '@/modules/retail-categories/services/retail-categories.service';
import { DosageFormsService } from '@/modules/dosage-forms/services/dosage-forms.service';
import { buildPaginationMeta } from '@/common/pagination';

@Injectable()
export class ProductsService {
    constructor(
        private readonly productsRepository: ProductsRepository,
        @Inject(forwardRef(() => ManufacturersService))
        private readonly manufacturersService: ManufacturersService,
        @Inject(forwardRef(() => ProductTypesService))
        private readonly productTypesService: ProductTypesService,
        @Inject(forwardRef(() => RetailCategoriesService))
        private readonly retailCategoriesService: RetailCategoriesService,
        @Inject(forwardRef(() => DosageFormsService))
        private readonly dosageFormsService: DosageFormsService,
    ) {}

    async findMany(query: ProductQueryDto) {
        const { limit, page } = query;
        const { records, total } = await this.productsRepository.findMany(query);
        if (!total || !page || !limit) return { records };
        const pagination = buildPaginationMeta({ currentPage: page, limit, totalRecords: total });
        return { records, pagination };
    }

    async findById(id: string) {
        const product = await this.productsRepository.findById(id);

        if (!product) {
            throw new NotFoundException(MESSAGES.ERROR.NOT_FOUND);
        }

        return product;
    }

    async create(dto: CreateProductDto, tx?: Prisma.TransactionClient) {
        await this.validateRelations(dto);

        const { barcode } = dto;

        const duplicate = await this.productsRepository.findByNameAndGenericName(
            dto.name,
            dto.generic_name,
            undefined,
            tx,
        );

        if (duplicate) {
            throw new ConflictException(MESSAGES.ERROR.ALREADY_EXISTS);
        }

        if (barcode) {
            const existing = await this.productsRepository.findByBarcode(barcode, undefined, tx);

            if (existing) {
                throw new ConflictException(MESSAGES.ERROR.BARCODE_ALREADY_EXISTS);
            }
        }

        return this.productsRepository.create(dto, tx);
    }

    async update(id: string, dto: UpdateProductDto) {
        await this.findById(id);

        await this.validateRelations(dto);

        if (dto.name !== undefined || dto.generic_name !== undefined) {
            // Fetch current values so we can check against the combined name+generic_name
            const current = await this.productsRepository.findById(id);

            const nameToCheck = dto.name ?? current!.name;
            const genericNameToCheck = dto.generic_name ?? current!.generic_name;

            const duplicate = await this.productsRepository.findByNameAndGenericName(
                nameToCheck,
                genericNameToCheck,
                id,
            );

            if (duplicate) {
                throw new ConflictException(MESSAGES.ERROR.ALREADY_EXISTS);
            }
        }

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

        return {
            message: MESSAGES.SUCCESS.DELETED,
        };
    }

    async existsByDosageForm(dosageFormId: string): Promise<boolean> {
        return this.productsRepository.existsByDosageForm(dosageFormId);
    }

    async existsByProductType(productTypeId: string): Promise<boolean> {
        return this.productsRepository.existsByProductType(productTypeId);
    }

    async existsByRetailCategory(retailCategoryId: string): Promise<boolean> {
        return this.productsRepository.existsByRetailCategory(retailCategoryId);
    }

    async existsByManufacturer(manufacturerId: string): Promise<boolean> {
        return this.productsRepository.existsByManufacturer(manufacturerId);
    }

    private async validateRelations(dto: CreateProductDto | UpdateProductDto) {
        if (dto.manufacturer_id) {
            await this.manufacturersService.get(dto.manufacturer_id);
        }

        if (dto.product_type_id) {
            await this.productTypesService.findById(dto.product_type_id);
        }

        if (dto.retail_category_id) {
            await this.retailCategoriesService.findById(dto.retail_category_id);
        }

        if (dto.dosage_form_id) {
            await this.dosageFormsService.findById(dto.dosage_form_id);
        }
    }
}
