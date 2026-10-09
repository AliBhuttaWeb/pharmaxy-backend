import { forwardRef, Module } from '@nestjs/common';
import { CategoriesConsoleController } from './controllers/categories.console.controller';
import { CategoriesService } from './services/categories.service';
import { CategoriesRepository } from './repositories/categories.repository';
import { ProductsModule } from '../products/products.module';

@Module({
    imports: [forwardRef(() => ProductsModule)],
    controllers: [CategoriesConsoleController],
    providers: [CategoriesService, CategoriesRepository],
    exports: [CategoriesService],
})
export class CategoriesModule {}
