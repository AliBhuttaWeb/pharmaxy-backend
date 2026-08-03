import { Module } from '@nestjs/common';
import { SuppliersService } from './services/suppliers.service';
import { SuppliersRepository } from './repositories/suppliers.repository';
import { SuppliersConsoleController } from './controllers/suppliers.console.controller';

@Module({
    controllers: [SuppliersConsoleController],
    providers: [SuppliersService, SuppliersRepository],
    exports: [SuppliersService],
})
export class SuppliersModule {}
