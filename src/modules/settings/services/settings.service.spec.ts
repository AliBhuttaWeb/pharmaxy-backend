import { ConflictException } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { MESSAGES } from '../constants';
import { AuthenticatedUser } from '@/modules/auth/types';
import { PREMIUM_FEATUIRES } from '@/modules/subscriptions/constants';

describe('SettingsService', () => {
    let service: SettingsService;
    let mockSettingsRepo: any;
    let mockSubscriptionConstraintService: any;

    const mockUser: AuthenticatedUser = {
        id: 'user-1',
        email: 'test@example.com',
        phone: null,
        first_name: 'John',
        last_name: 'Doe',
        status: 'ACTIVE' as any,
        pharmacy_id: 'pharmacy-1',
        branch_id: 'branch-1',
        is_email_verified: true,
        is_phone_verified: true,
        roles: [{ id: 'role-1', name: 'Branch Manager' } as any],
    };

    const mockBranchSettings = {
        id: 'setting-1',
        branch_id: 'branch-1',
        timezone: 'Asia/Karachi',
        currency: 'PKR',
        minimum_stock_quantity: 10,
        critical_stock_quantity: 5,
        expiry_alert_before_days: 30,
        enable_stock_sharing: false,
        share_inventory_details: false,
        allow_reservations: false,
    };

    beforeEach(() => {
        mockSettingsRepo = {
            findByBranchId: jest.fn(),
            createDefault: jest.fn(),
            upsert: jest.fn(),
        };

        mockSubscriptionConstraintService = {
            validateFeatureAccess: jest.fn(),
        };

        service = new SettingsService(
            mockSettingsRepo,
            mockSubscriptionConstraintService,
        );
    });

    describe('getSettings', () => {
        it('should return existing branch settings wrapped in { settings }', async () => {
            mockSettingsRepo.findByBranchId.mockResolvedValue(mockBranchSettings);

            const result = await service.getSettings(mockUser);

            expect(mockSettingsRepo.findByBranchId).toHaveBeenCalledWith('branch-1');
            expect(result).toEqual({ settings: mockBranchSettings });
            expect(mockSettingsRepo.createDefault).not.toHaveBeenCalled();
        });

        it('should create and return default settings when no settings exist for branch', async () => {
            mockSettingsRepo.findByBranchId.mockResolvedValue(null);
            mockSettingsRepo.createDefault.mockResolvedValue(mockBranchSettings);

            const result = await service.getSettings(mockUser);

            expect(mockSettingsRepo.findByBranchId).toHaveBeenCalledWith('branch-1');
            expect(mockSettingsRepo.createDefault).toHaveBeenCalledWith('branch-1');
            expect(result).toEqual({ settings: mockBranchSettings });
        });

        it('should throw ConflictException when user has no active branch', async () => {
            const userWithoutBranch = { ...mockUser, branch_id: null };

            await expect(service.getSettings(userWithoutBranch)).rejects.toThrow(ConflictException);
        });
    });

    describe('updateSettings', () => {
        it('should update and return { settings, message }', async () => {
            const dto = { timezone: 'UTC', currency: 'USD' };
            const updated = { ...mockBranchSettings, ...dto };
            mockSettingsRepo.upsert.mockResolvedValue(updated);

            const result = await service.updateSettings(mockUser, dto);

            expect(mockSettingsRepo.upsert).toHaveBeenCalledWith('branch-1', dto);
            expect(result).toEqual({
                settings: updated,
                message: MESSAGES.SUCCESS.UPDATED,
            });
            expect(mockSubscriptionConstraintService.validateFeatureAccess).not.toHaveBeenCalled();
        });

        it('should validate subscription feature access when enabling nearby search stock sharing', async () => {
            const dto = { enable_stock_sharing: true };
            const updated = { ...mockBranchSettings, enable_stock_sharing: true };
            mockSettingsRepo.upsert.mockResolvedValue(updated);

            const result = await service.updateSettings(mockUser, dto);

            expect(mockSubscriptionConstraintService.validateFeatureAccess).toHaveBeenCalledWith(
                mockUser,
                PREMIUM_FEATUIRES.NEARBY_INVENTORY,
            );
            expect(result).toEqual({
                settings: updated,
                message: MESSAGES.SUCCESS.UPDATED,
            });
        });

        it('should reject update if subscription constraint fails for nearby inventory', async () => {
            const dto = { allow_reservations: true };
            mockSubscriptionConstraintService.validateFeatureAccess.mockRejectedValue(
                new ConflictException('Feature not allowed in subscription plan'),
            );

            await expect(service.updateSettings(mockUser, dto)).rejects.toThrow(ConflictException);
            expect(mockSettingsRepo.upsert).not.toHaveBeenCalled();
        });
    });
});
