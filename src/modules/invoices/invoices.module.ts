import { Module } from '@nestjs/common';
import { InvoicesConsoleController } from './controllers/invoices.console.controller';
import { InvoicesService } from './services/invoices.service';
import { InvoicesRepository } from './repositories/invoices.repository';

@Module({
    controllers: [InvoicesConsoleController],
    providers: [InvoicesService, InvoicesRepository],
    exports: [InvoicesService, InvoicesRepository],
})
export class InvoicesModule {}
