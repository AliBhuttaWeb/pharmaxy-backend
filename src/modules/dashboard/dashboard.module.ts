import { Module } from '@nestjs/common';

import { BranchContextService } from '@/common/services/branch-context.service';

import { DashboardConsoleController } from './controllers/dashboard.console.controller';

import { DashboardService } from './services/dashboard.service';

import { DashboardRepository } from './repositories/dashboard.repository';

@Module({
    controllers: [DashboardConsoleController],

    providers: [DashboardService, DashboardRepository, BranchContextService],

    exports: [DashboardService],
})
export class DashboardModule {}
