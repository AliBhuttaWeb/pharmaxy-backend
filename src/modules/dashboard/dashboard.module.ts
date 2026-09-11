import { Module } from '@nestjs/common';

import { SubscriptionsModule } from '@/modules/subscriptions/subscriptions.module';

import { DashboardConsoleController } from './controllers/dashboard.console.controller';
import { DashboardRepository } from './repositories/dashboard.repository';
import { DashboardService } from './services/dashboard.service';

@Module({
    imports: [SubscriptionsModule],

    controllers: [DashboardConsoleController],

    providers: [DashboardService, DashboardRepository],

    exports: [DashboardService],
})
export class DashboardModule {}
