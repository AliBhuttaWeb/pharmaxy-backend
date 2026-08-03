import { Module } from '@nestjs/common';

import { BranchesModule } from '@/modules/branches/branches.module';
import { ProductsModule } from '@/modules/products/products.module';
import { SuppliersModule } from '@/modules/suppliers/suppliers.module';

import { PurchaseOrdersService } from './services/purchase-orders.service';
import { PurchaseOrdersRepository } from './repositories/purchase-orders-repository';
import { PurchaseOrdersConsoleController } from './controllers/purchase-orders.console.controller';
import { BranchesService } from '../branches/services/branches.service';
import { SuppliersService } from '../suppliers/services/suppliers.service';
import { ProductsService } from '../products/services/products.service';
import { BranchesRepository } from '../branches/repositories/branches.repository';
import { SuppliersRepository } from '../suppliers/repositories/suppliers.repository';
import { ProductsRepository } from '../products/repositories/products.repository';
import { ManufacturersRepository } from '../manufacturers/repositories/manufacturers.repository';
import { ProductTypesRepository } from '../product-types/repositories/product-types.repository';
import { RetailCategoriesRepository } from '../retail-categories/repositories/retail-categories.repository';
import { DosageFormsRepository } from '../dosage-forms/repositories/dosage-forms.repository';

@Module({
    imports: [BranchesModule, ProductsModule, SuppliersModule],

    controllers: [PurchaseOrdersConsoleController],

    providers: [PurchaseOrdersService, PurchaseOrdersRepository, BranchesService, SuppliersService, ProductsService, BranchesRepository, SuppliersRepository, ProductsRepository, ManufacturersRepository, ProductTypesRepository, RetailCategoriesRepository, DosageFormsRepository],

    exports: [],
})
export class PurchaseOrdersModule {}
