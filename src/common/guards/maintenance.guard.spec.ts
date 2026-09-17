import { ExecutionContext, ServiceUnavailableException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { MaintenanceGuard } from './maintenance.guard';
import { BYPASS_MAINTENANCE_KEY } from '@/common/decorators/bypass-maintenance.decorator';

describe('MaintenanceGuard', () => {
    let guard: MaintenanceGuard;
    let mockReflector: Partial<Reflector>;
    let mockConfigService: Partial<ConfigService>;
    let mockContext: Partial<ExecutionContext>;
    let mockRequest: any;

    beforeEach(() => {
        mockReflector = {
            getAllAndOverride: jest.fn(),
        };

        mockRequest = {
            headers: {},
        };

        mockContext = {
            getHandler: jest.fn(),
            getClass: jest.fn(),
            switchToHttp: jest.fn().mockReturnValue({
                getRequest: () => mockRequest,
            }),
        };
    });

    it('should allow request when maintenance mode is disabled', () => {
        mockConfigService = {
            get: jest.fn((key: string) => {
                if (key === 'maintenance.enabled') return false;
                return undefined;
            }),
        };

        guard = new MaintenanceGuard(
            mockReflector as Reflector,
            mockConfigService as ConfigService,
        );

        expect(guard.canActivate(mockContext as ExecutionContext)).toBe(true);
    });

    it('should throw ServiceUnavailableException when maintenance mode is enabled', () => {
        mockConfigService = {
            get: jest.fn((key: string) => {
                if (key === 'maintenance.enabled') return true;
                return undefined;
            }),
        };

        (mockReflector.getAllAndOverride as jest.Mock).mockReturnValue(false);

        guard = new MaintenanceGuard(
            mockReflector as Reflector,
            mockConfigService as ConfigService,
        );

        expect(() => guard.canActivate(mockContext as ExecutionContext)).toThrow(
            ServiceUnavailableException,
        );
    });

    it('should allow request when route has @BypassMaintenance() decorator', () => {
        mockConfigService = {
            get: jest.fn((key: string) => {
                if (key === 'maintenance.enabled') return true;
                return undefined;
            }),
        };

        (mockReflector.getAllAndOverride as jest.Mock).mockImplementation(
            (key: string) => key === BYPASS_MAINTENANCE_KEY,
        );

        guard = new MaintenanceGuard(
            mockReflector as Reflector,
            mockConfigService as ConfigService,
        );

        expect(guard.canActivate(mockContext as ExecutionContext)).toBe(true);
    });

    it('should allow request when matching x-maintenance-bypass header is present', () => {
        mockConfigService = {
            get: jest.fn((key: string) => {
                if (key === 'maintenance.enabled') return true;
                if (key === 'maintenance.bypassKey') return 'secret-admin-key';
                return undefined;
            }),
        };

        (mockReflector.getAllAndOverride as jest.Mock).mockReturnValue(false);
        mockRequest.headers['x-maintenance-bypass'] = 'secret-admin-key';

        guard = new MaintenanceGuard(
            mockReflector as Reflector,
            mockConfigService as ConfigService,
        );

        expect(guard.canActivate(mockContext as ExecutionContext)).toBe(true);
    });

    it('should reject request when x-maintenance-bypass header is incorrect', () => {
        mockConfigService = {
            get: jest.fn((key: string) => {
                if (key === 'maintenance.enabled') return true;
                if (key === 'maintenance.bypassKey') return 'secret-admin-key';
                return undefined;
            }),
        };

        (mockReflector.getAllAndOverride as jest.Mock).mockReturnValue(false);
        mockRequest.headers['x-maintenance-bypass'] = 'wrong-key';

        guard = new MaintenanceGuard(
            mockReflector as Reflector,
            mockConfigService as ConfigService,
        );

        expect(() => guard.canActivate(mockContext as ExecutionContext)).toThrow(
            ServiceUnavailableException,
        );
    });
});
