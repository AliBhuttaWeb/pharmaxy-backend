import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { BatchSourceType } from '@gen/prisma/client';

import { PrismaService } from '@/database/prisma/prisma.service';
import { buildPaginationMeta } from '@/common/pagination';
import { AuthenticatedUser } from '@/modules/auth/types';
import { getActiveBranchId } from '@/common/helpers';
import { ProductsService } from '@/modules/products/services/products.service';
import { BranchesService } from '@/modules/branches/services/branches.service';

import { MESSAGES } from '../constants/messages.constants';
import {
    BranchProductQueryDto,
    CreateBranchProductDto,
    ProductBatchQueryDto,
    ReceiveStockDto,
    UpdateBranchProductDto,
} from '../dtos';
import { BranchProductsRepository } from '../repositories/branch-products.repository';
import { ProductBatchesRepository } from '../repositories/product-batches.repository';

@Injectable()
export class BranchProductsService {
    constructor(
        private readonly prisma: PrismaService,

        private readonly branchProductsRepository: BranchProductsRepository,

        private readonly productBatchesRepository: ProductBatchesRepository,

        private readonly branchesService: BranchesService,

        private readonly productsService: ProductsService,
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

        return this.prisma.$transaction(async (tx) => {
            let productId = dto.branch_product.product_id;

            /**
             * Existing Product
             */
            if (productId) {
                await this.productsService.findById(productId);
            }

            /**
             * New Product
             */
            else {
                if (!dto.product) {
                    throw new ConflictException(MESSAGES.ERROR.PRODUCT_REQUIRED);
                }

                const product = await this.productsService.create(dto.product, tx);

                productId = product.id;
            }

            /**
             * Duplicate check
             */
            const existing = await this.branchProductsRepository.findByBranchAndProduct(
                branchId,
                productId,
                undefined,
                tx,
            );

            if (existing) {
                throw new ConflictException(MESSAGES.ERROR.ALREADY_EXISTS);
            }

            /**
             * Create Branch Product
             */
            const branchProduct = await this.branchProductsRepository.create(
                branchId,
                {
                    ...dto.branch_product,
                    product_id: productId,
                    quantity: dto.initial_batch.quantity,
                },
                tx,
            );

            /**
             * Initial Batch
             */
            await this.productBatchesRepository.create(
                {
                    branch_product_id: branchProduct.id,

                    batch_number: dto.initial_batch.batch_number,

                    manufacturing_date: dto.initial_batch.manufacturing_date,

                    expiry_date: dto.initial_batch.expiry_date,

                    purchase_price: dto.initial_batch.purchase_price,

                    mrp: dto.initial_batch.mrp,

                    quantity: dto.initial_batch.quantity,

                    source_type: BatchSourceType.PURCHASE_ORDER,
                },
                tx,
            );

            return this.branchProductsRepository.findById(branchProduct.id, branchId, tx);
        });
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

        await this.branchProductsRepository.delete(id);

        return {
            message: MESSAGES.SUCCESS.DELETED,
        };
    }

    async receiveStock(id: string, dto: ReceiveStockDto, user: AuthenticatedUser) {
        await this.findById(id, user);

        return this.prisma.$transaction(async (tx) => {
            const existingBatch =
                await this.productBatchesRepository.findByBranchProductAndBatchNumber(
                    id,
                    dto.batch_number,
                    tx,
                );

            let batch;
            if (existingBatch) {
                batch = await this.productBatchesRepository.incrementQuantity(
                    existingBatch.id,
                    dto.quantity,
                    tx,
                );
            } else {
                batch = await this.productBatchesRepository.createBatch(id, dto, tx);
            }

            await this.branchProductsRepository.incrementQuantity(id, dto.quantity, tx);

            return {
                message: MESSAGES.SUCCESS.STOCK_RECEIVED,
                batch,
            };
        });
    }

    async findBatches(id: string, user: AuthenticatedUser, query: ProductBatchQueryDto) {
        await this.findById(id, user);

        const { page, limit } = query;

        const { records, total } = await this.productBatchesRepository.findMany(id, page, limit);

        if (!total || !page || !limit) return { records };

        const pagination = buildPaginationMeta({ currentPage: page, limit, totalRecords: total });

        return { records, pagination };
    }
}
