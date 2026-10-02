import { Module } from '@nestjs/common';
import { SupportTicketsConsoleController } from './controllers/support-tickets.console.controller';
import { SupportTicketsService } from './services/support-tickets.service';
import { SupportTicketsRepository } from './repositories/support-tickets.repository';

@Module({
    controllers: [SupportTicketsConsoleController],
    providers: [SupportTicketsService, SupportTicketsRepository],
    exports: [SupportTicketsService, SupportTicketsRepository],
})
export class SupportTicketsModule {}
