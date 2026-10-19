import { Module } from '@nestjs/common';
import { BranchesModule } from '../branches/branches.module';
import { ProductsModule } from '../products/products.module';
import { BranchProductsConsoleController } from './controllers/branch-products.console.controller';
import { BranchProductsRepository } from './repositories/branch-products.repository';
import { BranchProductBatchesRepository } from './repositories/branch-product-batches.repository';
import { BranchProductsService } from './services/branch-products.service';

@Module({
    imports: [BranchesModule, ProductsModule],

    controllers: [BranchProductsConsoleController],

    providers: [BranchProductsRepository, BranchProductBatchesRepository, BranchProductsService],

    exports: [BranchProductsRepository, BranchProductBatchesRepository],
})
export class BranchProductsModule {}
