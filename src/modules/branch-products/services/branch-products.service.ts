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

@Injectable()
export class BranchProductsService {
    constructor(
        private readonly branchProductsRepository: BranchProductsRepository,

        private readonly branchesService: BranchesService,

        private readonly productsService: ProductsService,
        private readonly onboardBranchProductService: OnboardBranchProductService,
    ) {}

    async findMany(query: BranchProductQueryDto) {
        const { limit, page } = query;
        const { records, total } = await this.branchProductsRepository.findMany(query);
        if (!total || !page || !limit) return { records };
        const pagination = buildPaginationMeta({ currentPage: page, limit, totalRecords: total });
        return { records, pagination };
    }

    async findById(id: string) {
        const branchProduct = await this.branchProductsRepository.findById(id);

        if (!branchProduct) {
            throw new NotFoundException(MESSAGES.ERROR.NOT_FOUND);
        }

        return branchProduct;
    }

    async create(dto: CreateBranchProductDto, user: AuthenticatedUser) {
        if (!user.branch_id) {
            throw new ForbiddenException(MESSAGES.ERROR.BRANCH_ID_MISSING);
        }

        await this.branchesService.findById(user.branch_id);

        await this.productsService.findById(dto.product_id);

        const existing = await this.branchProductsRepository.findByBranchAndProduct(
            user.branch_id,
            dto.product_id,
        );

        if (existing) {
            throw new ConflictException(MESSAGES.ERROR.ALREADY_EXISTS);
        }

        return this.branchProductsRepository.create(user.branch_id, dto);
    }

    async update(id: string, dto: UpdateBranchProductDto) {
        const branchProduct = await this.findById(id);

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

    async delete(id: string) {
        await this.findById(id);

        return this.branchProductsRepository.delete(id);
    }

    onboard(dto: OnboardBranchProductDto, user: AuthenticatedUser) {
        if (!user.branch_id) {
            throw new ForbiddenException(MESSAGES.ERROR.BRANCH_ID_MISSING);
        }

        return this.onboardBranchProductService.execute(dto, user.branch_id);
    }

    async receiveStock(id: string, dto: ReceiveStockDto) {
        await this.findById(id);

        const batch = await this.branchProductsRepository.createBatch(id, dto);

        return {
            message: MESSAGES.SUCCESS.STOCK_RECEIVED,
            batch,
        };
    }

    async findBatches(id: string) {
        await this.findById(id);

        return this.branchProductsRepository.findBatches(id);
    }
}
