import { Module } from '@nestjs/common';
import { BranchesModule } from '../branches/branches.module';
import { ProductsModule } from '../products/products.module';
import { BranchProductsConsoleController } from './controllers/branch-products.console.controller';
import { BranchProductsRepository } from './repositories/branch-products.repository';
import { ProductBatchesRepository } from './repositories/product-batches.repository';
import { BranchProductsService } from './services/branch-products.service';
import { OnboardBranchProductService } from './services/onboard-branch-products.service';

@Module({
    imports: [BranchesModule, ProductsModule],

    controllers: [BranchProductsConsoleController],

    providers: [
        BranchProductsRepository,
        ProductBatchesRepository,
        BranchProductsService,
        OnboardBranchProductService,
    ],

    exports: [BranchProductsRepository, ProductBatchesRepository],
})
export class BranchProductsModule {}
