import { forwardRef, Module } from '@nestjs/common';
import { ProductTypesConsoleController } from './controllers/product-types.console.controller';
import { ProductTypesRepository } from './repositories/product-types.repository';
import { ProductTypesService } from './services/product-types.service';
import { ProductsModule } from '../products/products.module';

@Module({
    imports: [forwardRef(() => ProductsModule)],

    controllers: [ProductTypesConsoleController],

    providers: [ProductTypesRepository, ProductTypesService],

    exports: [ProductTypesService],
})
export class ProductTypesModule {}
