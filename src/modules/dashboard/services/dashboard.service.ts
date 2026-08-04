import { Injectable } from '@nestjs/common';

import { AuthenticatedUser } from '@/modules/auth/types';

import { BranchContextService } from '@/common/services/branch-context.service';

import { DashboardRepository } from '../repositories/dashboard.repository';

@Injectable()
export class DashboardService {
    constructor(
        private readonly dashboardRepository: DashboardRepository,

        private readonly branchContextService: BranchContextService,
    ) {}

    async overview(user: AuthenticatedUser) {
        const { branchId } = await this.branchContextService.get(user);

        return this.dashboardRepository.overview(branchId);
    }
}
