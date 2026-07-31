import { Module } from '@nestjs/common';
import { ManufacturersService } from './services/manufacturer.service';
import { ManufacturersRepository } from './repositories/manufacturers.repository';
import { ManufacturersConsoleController } from './controllers/manufacturer.console.controller';

@Module({
    controllers: [ManufacturersConsoleController],
    providers: [ManufacturersService, ManufacturersRepository],
    exports: [ManufacturersRepository],
})
export class ManufacturersModule {}
