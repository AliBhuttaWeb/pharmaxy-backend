import { Injectable } from '@nestjs/common';
import { AuthenticatedUser } from '@/modules/auth/types';
import { getActiveBranchId } from '@/common/helpers';
import { SettingsRepository } from '../repositories/settings.repository';
import { UpdateSettingsDto } from '../dtos';
import { MESSAGES } from '../constants';
import { SubscriptionConstraintService } from '@/modules/subscriptions/services/subscription-constraint.service';
import { PREMIUM_FEATUIRES } from '@/modules/subscriptions/constants';

@Injectable()
export class SettingsService {
    constructor(
        private readonly settingsRepository: SettingsRepository,
        private readonly subscriptionConstraintService: SubscriptionConstraintService,
    ) {}

    async getSettings(user: AuthenticatedUser) {
        const branchId = getActiveBranchId(user);

        let settings = await this.settingsRepository.findByBranchId(branchId);

        if (!settings) {
            settings = await this.settingsRepository.createDefault(branchId);
        }

        return { settings };
    }

    async updateSettings(user: AuthenticatedUser, dto: UpdateSettingsDto) {
        const branchId = getActiveBranchId(user);

        const wantsNearbyInventory =
            dto.enable_stock_sharing === true ||
            dto.share_inventory_details === true ||
            dto.allow_reservations === true;

        if (wantsNearbyInventory) {
            await this.subscriptionConstraintService.validateFeatureAccess(
                user,
                PREMIUM_FEATUIRES.NEARBY_INVENTORY,
            );
        }

        const settings = await this.settingsRepository.upsert(branchId, dto);

        return {
            settings,
            message: MESSAGES.SUCCESS.UPDATED,
        };
    }
}
