import { Module } from '@nestjs/common';
import { ProductTypesConsoleController } from './controllers/product-types.console.controller';
import { ProductTypesRepository } from './repositories/product-types.repository';
import { ProductTypesService } from './services/product-types.service';

@Module({
    controllers: [ProductTypesConsoleController],

    providers: [ProductTypesRepository, ProductTypesService],

    exports: [],
})
export class ProductTypesModule {}
