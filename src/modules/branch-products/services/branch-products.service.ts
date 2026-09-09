import {
    ConflictException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { MESSAGES } from '../constants/messages.constants';
import {
    BranchProductQueryDto,
    CreateBranchProductDto,
    OnboardBranchProductDto,
    ReceiveStockDto,
    UpdateBranchProductDto,
} from '../dtos';
import { BranchProductsRepository } from '../repositories/branch-products.repository';
import { BranchesService } from '@/modules/branches/services/branches.service';
import { ProductsService } from '@/modules/products/services/products.service';
import { OnboardBranchProductService } from './onboard-branch-products.service';
import { buildPaginationMeta } from '@/common/pagination';
import { AuthenticatedUser } from '@/modules/auth/types';
import { getActiveBranchId } from '@/common/helpers';

@Injectable()
export class BranchProductsService {
    constructor(
        private readonly branchProductsRepository: BranchProductsRepository,

        private readonly branchesService: BranchesService,

        private readonly productsService: ProductsService,
        private readonly onboardBranchProductService: OnboardBranchProductService,
    ) {}

    async findMany(query: BranchProductQueryDto, user) {
        query.branch_id = getActiveBranchId(user);

        const { limit, page } = query;
        const { records, total } = await this.branchProductsRepository.findMany(query);
        if (!total || !page || !limit) return { records };
        const pagination = buildPaginationMeta({ currentPage: page, limit, totalRecords: total });
        return { records, pagination };
    }

    async findById(id: string, user: AuthenticatedUser) {
        const branchId = getActiveBranchId(user);
        
        const branchProduct = await this.branchProductsRepository.findById(id, branchId);

        if (!branchProduct) {
            throw new NotFoundException(MESSAGES.ERROR.NOT_FOUND);
        }

        return branchProduct;
    }

    async create(dto: CreateBranchProductDto, user: AuthenticatedUser) {
        const branchId = getActiveBranchId(user);

        await this.branchesService.findById(branchId);

        await this.productsService.findById(dto.product_id);

        const existing = await this.branchProductsRepository.findByBranchAndProduct(
            branchId,
            dto.product_id,
        );

        if (existing) {
            throw new ConflictException(MESSAGES.ERROR.ALREADY_EXISTS);
        }

        return this.branchProductsRepository.create(branchId, dto);
    }

    async update(id: string, dto: UpdateBranchProductDto, user: AuthenticatedUser) {
        const branchProduct = await this.findById(id, user);

        const branchId = branchProduct.branch_id;

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

    async delete(id: string, user: AuthenticatedUser) {
        await this.findById(id, user);

        return this.branchProductsRepository.delete(id);
    }

    async onboard(dto: OnboardBranchProductDto, user: AuthenticatedUser) {
        const branchId = getActiveBranchId(user);

        return this.onboardBranchProductService.execute(dto, branchId);
    }

    async receiveStock(id: string, dto: ReceiveStockDto, user: AuthenticatedUser) {
        await this.findById(id, user);

        const batch = await this.branchProductsRepository.createBatch(id, dto);

        return {
            message: MESSAGES.SUCCESS.STOCK_RECEIVED,
            batch,
        };
    }

    async findBatches(id: string, user: AuthenticatedUser) {
        await this.findById(id, user);

        return this.branchProductsRepository.findBatches(id);
    }
}
