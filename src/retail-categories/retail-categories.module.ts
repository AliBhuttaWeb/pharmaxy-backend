import { Module } from '@nestjs/common';
import { RetailCategoryConsoleController } from './controllers/retail-category.console.controller';
import { RetailCategoryRepository } from './repositories/retail-category.repository';
import { RetailCategoryService } from './services/retail-category.service';

@Module({
    imports: [],
    controllers: [RetailCategoryConsoleController],
    providers: [RetailCategoryService, RetailCategoryRepository],
    exports: [],
})
export class RetailCategoriesModule {}
