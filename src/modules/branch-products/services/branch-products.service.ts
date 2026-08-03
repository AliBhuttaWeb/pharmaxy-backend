import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import { MESSAGES } from '../constants/messages.constants';
import {
    BranchProductQueryDto,
    CreateBranchProductDto,
    OnboardBranchProductDto,
    UpdateBranchProductDto,
} from '../dtos';
import { BranchProductsRepository } from '../repositories/branch-products.repository';
import { BranchesService } from '@/modules/branches/services/branches.service';
import { ProductsService } from '@/modules/products/services/products.service';
import { Prisma } from '@prisma/client';
import { OnboardBranchProductService } from './onboard-branch-products.service';

@Injectable()
export class BranchProductsService {
    constructor(
        private readonly branchProductsRepository: BranchProductsRepository,

        private readonly branchesService: BranchesService,

        private readonly productsService: ProductsService,
        private readonly onboardBranchProductService: OnboardBranchProductService,
    ) {}

    findMany(query: BranchProductQueryDto) {
        return this.branchProductsRepository.findMany(query);
    }

    async findById(id: string) {
        const branchProduct = await this.branchProductsRepository.findById(id);

        if (!branchProduct) {
            throw new NotFoundException(MESSAGES.ERROR.NOT_FOUND);
        }

        return branchProduct;
    }

    async create(dto: CreateBranchProductDto) {
        await this.branchesService.findById(dto.branch_id);

        await this.productsService.findById(dto.product_id);

        const existing = await this.branchProductsRepository.findByBranchAndProduct(
            dto.branch_id,
            dto.product_id,
        );

        if (existing) {
            throw new ConflictException(MESSAGES.ERROR.ALREADY_EXISTS);
        }

        return this.branchProductsRepository.create(dto);
    }

    async update(id: string, dto: UpdateBranchProductDto) {
        const branchProduct = await this.findById(id);

        const branchId = dto.branch_id ?? branchProduct.branch_id;

        const productId = dto.product_id ?? branchProduct.product_id;

        await this.branchesService.findById(branchId);

        await this.productsService.findById(productId);

        const existing = await this.branchProductsRepository.findByBranchAndProduct(
            branchId,
            productId,
            id,
        );

        if (existing) {
            throw new ConflictException(MESSAGES.ERROR.ALREADY_EXISTS);
        }

        return this.branchProductsRepository.update(id, dto);
    }

    async delete(id: string) {
        await this.findById(id);

        return this.branchProductsRepository.delete(id);
    }

    onboard(dto: OnboardBranchProductDto) {
        return this.onboardBranchProductService.execute(dto);
    }
}
