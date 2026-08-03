import { Module } from '@nestjs/common';
import { ManufacturersModule } from '../manufacturers/manufacturers.module';
import { RetailCategoriesModule } from '../retail-categories/retail-categories.module';
import { DosageFormsModule } from '../dosage-forms/dosage-forms.module';
import { ProductTypesModule } from '../product-types/product-types.module';
import { ProductsConsoleController } from './controllers/products.consoe.controller';
import { ProductsRepository } from './repositories/products.repository';
import { ProductsService } from './services/products.service';

@Module({
    imports: [ManufacturersModule, ProductTypesModule, RetailCategoriesModule, DosageFormsModule],

    controllers: [ProductsConsoleController],

    providers: [ProductsRepository, ProductsService],

    exports: [ProductsService],
})
export class ProductsModule {}
