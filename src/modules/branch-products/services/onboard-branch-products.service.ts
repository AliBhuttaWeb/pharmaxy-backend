import { ConflictException, Injectable } from '@nestjs/common';
import { BatchSourceType, Prisma } from '@gen/prisma/client';

import { PrismaService } from '@/database/prisma/prisma.service';

import { ProductsService } from '@/modules/products/services/products.service';

import { BranchProductsRepository } from '../repositories/branch-products.repository';
import { ProductBatchesRepository } from '../repositories/product-batches.repository';
import { OnboardBranchProductDto } from '../dtos';
import { MESSAGES } from '../constants/messages.constants';

@Injectable()
export class OnboardBranchProductService {
    constructor(
        private readonly prisma: PrismaService,

        private readonly productsService: ProductsService,

        private readonly branchProductsRepository: BranchProductsRepository,

        private readonly productBatchesRepository: ProductBatchesRepository,
    ) {}

    async execute(dto: OnboardBranchProductDto) {
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
                dto.branch_product.branch_id,
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
                {
                    ...dto.branch_product,
                    product_id: productId,
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

            return this.branchProductsRepository.findById(branchProduct.id, tx);
        });
    }
}
