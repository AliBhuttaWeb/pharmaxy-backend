import { ConflictException } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { MESSAGES } from '../constants';
import { AuthenticatedUser } from '@/modules/auth/types';

describe('SettingsService', () => {
    let service: SettingsService;
    let mockSettingsRepo: any;

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

        service = new SettingsService(mockSettingsRepo);
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
        it('should update and return { settings, message } when thresholds are valid', async () => {
            const dto = { timezone: 'UTC', currency: 'USD' };
            const updated = { ...mockBranchSettings, ...dto };
            mockSettingsRepo.findByBranchId.mockResolvedValue(mockBranchSettings);
            mockSettingsRepo.upsert.mockResolvedValue(updated);

            const result = await service.updateSettings(mockUser, dto);

            expect(mockSettingsRepo.upsert).toHaveBeenCalledWith('branch-1', dto);
            expect(result).toEqual({
                settings: updated,
                message: MESSAGES.SUCCESS.UPDATED,
            });
        });

        it('should throw ConflictException if critical_stock_quantity exceeds minimum_stock_quantity in dto', async () => {
            const dto = {
                minimum_stock_quantity: 5,
                critical_stock_quantity: 15,
            };
            mockSettingsRepo.findByBranchId.mockResolvedValue(mockBranchSettings);

            await expect(service.updateSettings(mockUser, dto)).rejects.toThrow(
                new ConflictException(MESSAGES.ERROR.CRITICAL_EXCEEDS_MINIMUM),
            );
            expect(mockSettingsRepo.upsert).not.toHaveBeenCalled();
        });

        it('should throw ConflictException if updated critical_stock_quantity exceeds existing minimum', async () => {
            const dto = { critical_stock_quantity: 20 };
            mockSettingsRepo.findByBranchId.mockResolvedValue(mockBranchSettings); // min is 10

            await expect(service.updateSettings(mockUser, dto)).rejects.toThrow(
                new ConflictException(MESSAGES.ERROR.CRITICAL_EXCEEDS_MINIMUM),
            );
            expect(mockSettingsRepo.upsert).not.toHaveBeenCalled();
        });
    });

    describe('validateNearbySharingAccess', () => {
        it('should throw ConflictException when branch has not enabled stock sharing', async () => {
            mockSettingsRepo.findByBranchId.mockResolvedValue({
                ...mockBranchSettings,
                enable_stock_sharing: false,
            });

            await expect(service.validateNearbySharingAccess('branch-1')).rejects.toThrow(
                new ConflictException(MESSAGES.ERROR.STOCK_SHARING_NOT_ALLOWED),
            );
        });

        it('should succeed when branch has enabled stock sharing', async () => {
            mockSettingsRepo.findByBranchId.mockResolvedValue({
                ...mockBranchSettings,
                enable_stock_sharing: true,
            });

            await expect(service.validateNearbySharingAccess('branch-1')).resolves.toBeUndefined();
        });
    });

    describe('validateReservationAccess', () => {
        it('should throw ConflictException when branch has not enabled reservations', async () => {
            mockSettingsRepo.findByBranchId.mockResolvedValue({
                ...mockBranchSettings,
                allow_reservations: false,
            });

            await expect(service.validateReservationAccess('branch-1')).rejects.toThrow(
                new ConflictException(MESSAGES.ERROR.RESERVATIONS_NOT_ALLOWED),
            );
        });

        it('should succeed when branch has enabled reservations', async () => {
            mockSettingsRepo.findByBranchId.mockResolvedValue({
                ...mockBranchSettings,
                allow_reservations: true,
            });

            await expect(service.validateReservationAccess('branch-1')).resolves.toBeUndefined();
        });
    });

    describe('getStockAlertLevel', () => {
        it('should return CRITICAL when quantity is at or below critical threshold', async () => {
            mockSettingsRepo.findByBranchId.mockResolvedValue(mockBranchSettings);

            expect(await service.getStockAlertLevel('branch-1', 5)).toBe('CRITICAL');
            expect(await service.getStockAlertLevel('branch-1', 2)).toBe('CRITICAL');
        });

        it('should return LOW when quantity is between critical and minimum threshold', async () => {
            mockSettingsRepo.findByBranchId.mockResolvedValue(mockBranchSettings);

            expect(await service.getStockAlertLevel('branch-1', 8)).toBe('LOW');
            expect(await service.getStockAlertLevel('branch-1', 10)).toBe('LOW');
        });

        it('should return NORMAL when quantity is above minimum threshold', async () => {
            mockSettingsRepo.findByBranchId.mockResolvedValue(mockBranchSettings);

            expect(await service.getStockAlertLevel('branch-1', 11)).toBe('NORMAL');
            expect(await service.getStockAlertLevel('branch-1', 50)).toBe('NORMAL');
        });
    });
});
