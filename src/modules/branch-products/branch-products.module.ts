import { Module } from '@nestjs/common';
import { BranchesModule } from '../branches/branches.module';
import { ProductsModule } from '../products/products.module';
import { BranchProductsConsoleController } from './controllers/branch-products.console.controller';
import { BranchProductsRepository } from './repositories/branch-products.repository';
import { BranchProductsService } from './services/branch-products.service';
import { BranchesService } from '../branches/services/branches.service';
import { ProductsService } from '../products/services/products.service';
import { BranchesRepository } from '../branches/repositories/branches.repository';
import { ProductsRepository } from '../products/repositories/products.repository';
import { ManufacturersRepository } from '../manufacturers/repositories/manufacturers.repository';
import { ProductTypesRepository } from '../product-types/repositories/product-types.repository';
import { RetailCategoriesRepository } from '../retail-categories/repositories/retail-categories.repository';
import { DosageFormsRepository } from '../dosage-forms/repositories/dosage-forms.repository';

@Module({
    imports: [BranchesModule, ProductsModule],

    controllers: [BranchProductsConsoleController],

    providers: [
        BranchProductsRepository,
        BranchesRepository,
        ManufacturersRepository,
        ProductTypesRepository,
        RetailCategoriesRepository,
        ProductsRepository,
        DosageFormsRepository,
        BranchProductsService,
        BranchesService,
        ProductsService,
    ],

    exports: [],
})
export class BranchProductsModule {}
