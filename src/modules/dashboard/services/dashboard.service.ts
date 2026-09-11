import { Injectable } from '@nestjs/common';

import { AuthenticatedUser } from '@/modules/auth/types';
import { SubscriptionConstraintService } from '@/modules/subscriptions/services/subscription-constraint.service';
import { getActiveBranchId, getPharmacyId, isPharmacyAdmin, isSuperAdmin } from '@/common/helpers';

import { DashboardQueryDto } from '../dtos';
import { DashboardRepository } from '../repositories/dashboard.repository';

@Injectable()
export class DashboardService {
    constructor(
        private readonly dashboardRepository: DashboardRepository,
        private readonly subscriptionConstraintService: SubscriptionConstraintService,
    ) {}

    async overview(user: AuthenticatedUser, query?: DashboardQueryDto) {
        const branchId = getActiveBranchId(user);
        const pharmacyId = getPharmacyId(user);

        const days = query?.days ?? 7;

        if (pharmacyId) {
            await this.subscriptionConstraintService.validateReportAccess(pharmacyId, days);
        }

        const isAdmin = isPharmacyAdmin(user.roles) || isSuperAdmin(user.roles);
        const userId = isAdmin ? undefined : user.id;

        return this.dashboardRepository.overview(branchId, days, userId);
    }
}

