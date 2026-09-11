import { ConflictException, Injectable } from '@nestjs/common';
import { BranchSettings } from '@gen/prisma/client';
import { AuthenticatedUser } from '@/modules/auth/types';
import { getActiveBranchId } from '@/common/helpers';
import { SettingsRepository } from '../repositories/settings.repository';
import { UpdateSettingsDto } from '../dtos';
import { DEFAULT_BRANCH_SETTINGS, MESSAGES } from '../constants';

@Injectable()
export class SettingsService {
    constructor(private readonly settingsRepository: SettingsRepository) {}

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

        const currentSettings = await this.settingsRepository.findByBranchId(branchId);

        this.validateThresholds(dto, currentSettings);

        const settings = await this.settingsRepository.upsert(branchId, dto);

        return {
            settings,
            message: MESSAGES.SUCCESS.UPDATED,
        };
    }

    /**
     * Validates that critical stock quantity does not exceed minimum stock quantity.
     */
    private validateThresholds(
        dto: UpdateSettingsDto,
        currentSettings?: BranchSettings | null,
    ): void {
        const effectiveMin =
            dto.minimum_stock_quantity ??
            currentSettings?.minimum_stock_quantity ??
            DEFAULT_BRANCH_SETTINGS.minimum_stock_quantity;

        const effectiveCritical =
            dto.critical_stock_quantity ??
            currentSettings?.critical_stock_quantity ??
            DEFAULT_BRANCH_SETTINGS.critical_stock_quantity;

        if (effectiveCritical > effectiveMin) {
            throw new ConflictException(MESSAGES.ERROR.CRITICAL_EXCEEDS_MINIMUM);
        }
    }
}
