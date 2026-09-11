import { forwardRef, Module } from '@nestjs/common';
import { ManufacturersService } from './services/manufacturer.service';
import { ManufacturersRepository } from './repositories/manufacturers.repository';
import { ManufacturersConsoleController } from './controllers/manufacturer.console.controller';
import { ProductsModule } from '../products/products.module';

@Module({
    imports: [forwardRef(() => ProductsModule)],
    controllers: [ManufacturersConsoleController],
    providers: [ManufacturersService, ManufacturersRepository],
    exports: [ManufacturersService],
})
export class ManufacturersModule {}
