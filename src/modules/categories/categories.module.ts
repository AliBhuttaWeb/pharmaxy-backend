import { Module } from '@nestjs/common';
import { CategoriesConsoleController } from './controllers/categories.console.controller';
import { CategoriesService } from './services/categories.service';
import { CategoriesRepository } from './repositories/categories.repository';


@Module({
    controllers: [
        CategoriesConsoleController,
    ],
    providers: [
        CategoriesService,
        CategoriesRepository,
    ],
    exports: [
        
    ],
})
export class CategoriesModule {}