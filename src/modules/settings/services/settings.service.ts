import { ConflictException, Injectable } from '@nestjs/common';
import { BranchSettings } from '@gen/prisma/client';
import { AuthenticatedUser } from '@/modules/auth/types';
import { getActiveBranchId } from '@/common/helpers';
import { SettingsRepository } from '../repositories/settings.repository';
import { UpdateSettingsDto } from '../dtos';
import { DEFAULT_BRANCH_SETTINGS, MESSAGES } from '../constants';

export type StockAlertLevel = 'NORMAL' | 'LOW' | 'CRITICAL';

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
     * Asserts that the branch has stock sharing enabled for nearby lookups.
     */
    async validateNearbySharingAccess(branchId: string): Promise<void> {
        const settings = await this.settingsRepository.findByBranchId(branchId);

        if (!settings || !settings.enable_stock_sharing) {
            throw new ConflictException(MESSAGES.ERROR.STOCK_SHARING_NOT_ALLOWED);
        }
    }

    /**
     * Asserts that the branch has inventory reservations enabled.
     */
    async validateReservationAccess(branchId: string): Promise<void> {
        const settings = await this.settingsRepository.findByBranchId(branchId);

        if (!settings || !settings.allow_reservations) {
            throw new ConflictException(MESSAGES.ERROR.RESERVATIONS_NOT_ALLOWED);
        }
    }

    /**
     * Evaluates current stock quantity against branch settings threshold levels.
     */
    async getStockAlertLevel(branchId: string, currentQuantity: number): Promise<StockAlertLevel> {
        const settings = await this.settingsRepository.findByBranchId(branchId);

        const criticalThreshold =
            settings?.critical_stock_quantity ?? DEFAULT_BRANCH_SETTINGS.critical_stock_quantity;
        const minThreshold =
            settings?.minimum_stock_quantity ?? DEFAULT_BRANCH_SETTINGS.minimum_stock_quantity;

        if (currentQuantity <= criticalThreshold) {
            return 'CRITICAL';
        }

        if (currentQuantity <= minThreshold) {
            return 'LOW';
        }

        return 'NORMAL';
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
