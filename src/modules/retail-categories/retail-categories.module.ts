import { Module } from '@nestjs/common';
import { RetailCategoriesConsoleController } from './controllers/retail-categories.console.controller';
import { RetailCategoriesService } from './services/retail-categories.service';
import { RetailCategoriesRepository } from './repositories/retail-categories.repository';

@Module({
    controllers: [RetailCategoriesConsoleController],
    providers: [RetailCategoriesService, RetailCategoriesRepository],
    exports: [RetailCategoriesService],
})
export class RetailCategoriesModule {}
