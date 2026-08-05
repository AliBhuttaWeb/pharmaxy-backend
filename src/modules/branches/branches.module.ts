import { Module } from '@nestjs/common';
import { BranchesConsoleController } from './controllers/branches.console.controller';
import { BranchesService } from './services/branches.service';
import { BranchesRepository } from './repositories/branches.repository';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';

@Module({
    imports: [SubscriptionsModule],
    controllers: [BranchesConsoleController],
    providers: [BranchesService, BranchesRepository],
    exports: [BranchesService],
})
export class BranchesModule {}
