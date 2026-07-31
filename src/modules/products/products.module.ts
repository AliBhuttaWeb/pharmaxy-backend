import { Module } from '@nestjs/common';
import { ManufacturersModule } from '../manufacturers/manufacturers.module';
import { RetailCategoriesModule } from '../retail-categories/retail-categories.module';
import { DosageFormsModule } from '../dosage-forms/dosage-forms.module';
import { ProductsConsoleController } from './controllers/products.consoe.controller';
import { ProductsRepository } from './repositories/products.repository';
import { ProductsService } from './services/products.service';
import { ProductTypesModule } from '../product-types/product-types.module';
import { ProductTypesRepository } from '../product-types/repositories/product-types.repository';
import { RetailCategoriesRepository } from '../retail-categories/repositories/retail-categories.repository';
import { DosageFormsRepository } from '../dosage-forms/repositories/dosage-forms.repository';

@Module({
    imports: [ManufacturersModule, ProductTypesModule, RetailCategoriesModule, DosageFormsModule],

    controllers: [ProductsConsoleController],

    providers: [
        ProductsRepository,
        ProductsService,
        ProductTypesRepository,
        RetailCategoriesRepository,
        DosageFormsRepository,
    ],

    exports: [],
})
export class ProductsModule {}
