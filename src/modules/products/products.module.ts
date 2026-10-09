import { forwardRef, Module } from '@nestjs/common';
import { ProductsConsoleController } from './controllers/products.consoe.controller';
import { ProductsRepository } from './repositories/products.repository';
import { ProductsService } from './services/products.service';
import { ManufacturersModule } from '../manufacturers/manufacturers.module';
import { CategoriesModule } from '../categories/categories.module';
import { DosageFormsModule } from '../dosage-forms/dosage-forms.module';

@Module({
    imports: [
        forwardRef(() => ManufacturersModule),
        forwardRef(() => CategoriesModule),
        forwardRef(() => DosageFormsModule),
    ],

    controllers: [ProductsConsoleController],

    providers: [ProductsRepository, ProductsService],

    exports: [ProductsService],
})
export class ProductsModule {}
