import { Get } from '@nestjs/common';

import { ConsoleController, CurrentUser, Permissions } from '@/common/decorators';

import { AuthenticatedUser } from '@/modules/auth/types';

import { DASHBOARD_PERMISSIONS } from '@/common/constants';

import { DashboardService } from '../services/dashboard.service';

@ConsoleController('dashboard')
export class DashboardConsoleController {
    constructor(private readonly dashboardService: DashboardService) {}

    @Get()
    @Permissions(DASHBOARD_PERMISSIONS.DASHBOARD_VIEW.name)
    overview(@CurrentUser() user: AuthenticatedUser) {
        return this.dashboardService.overview(user);
    }
}
