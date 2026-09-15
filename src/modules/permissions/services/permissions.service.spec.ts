import { NotFoundException } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { MESSAGES } from '../constants/messages.constants';
import { PermissionEffect } from '@gen/prisma/client';

describe('PermissionsService', () => {
    let service: PermissionsService;
    let mockPrisma: any;
    let mockPermissionsRepository: any;
    let mockUserPermissionsService: any;
    let mockRolePermissionsService: any;

    beforeEach(() => {
        mockPrisma = {
            transaction: jest.fn(),
        };

        mockPermissionsRepository = {
            findMany: jest.fn(),
            findManyForGrouping: jest.fn(),
            findById: jest.fn(),
            getRolePermissions: jest.fn(),
            getUserPermissionOverrides: jest.fn(),
            deletePermissionOverrides: jest.fn(),
            createPermissionOverride: jest.fn(),
            updatePermissionOverride: jest.fn(),
        };

        mockUserPermissionsService = {
            findUserPermissions: jest.fn(),
        };

        mockRolePermissionsService = {
            findUserRolePermissions: jest.fn(),
        };

        service = new PermissionsService(
            mockPrisma,
            mockPermissionsRepository,
            mockUserPermissionsService,
            mockRolePermissionsService,
        );
    });

    describe('list', () => {
        it('should call permissionsRepository.findManyForGrouping and return grouped permissions', async () => {
            const query = { module: 'Users' };
            const rawPermissions = [
                { id: '1', name: 'users.create', description: 'Create users', module: 'Users' },
            ];
            mockPermissionsRepository.findManyForGrouping.mockResolvedValue(rawPermissions);

            const result = await service.list(query);

            expect(mockPermissionsRepository.findManyForGrouping).toHaveBeenCalledWith(query);
            expect(result).toEqual({
                permissions: {
                    Users: [{ id: '1', name: 'users.create', description: 'Create users' }],
                },
            });
        });
    });

    describe('get', () => {
        it('should throw NotFoundException if permission not found', async () => {
            mockPermissionsRepository.findById.mockResolvedValue(null);

            await expect(service.get('non-existent')).rejects.toThrow(
                new NotFoundException(MESSAGES.ERROR.NOT_FOUND),
            );
        });

        it('should return permission when found', async () => {
            const permission = { id: '1', name: 'users.create', module: 'Users' };
            mockPermissionsRepository.findById.mockResolvedValue(permission);

            const result = await service.get('1');
            expect(result).toEqual(permission);
        });
    });

    describe('getUserPermissions', () => {
        it('should return combined role and user override permissions', async () => {
            mockRolePermissionsService.findUserRolePermissions.mockResolvedValue([
                {
                    role: {
                        role_permissions: [
                            { permission: { name: 'users.view' } },
                            { permission: { name: 'sales.create' } },
                        ],
                    },
                },
            ]);

            mockUserPermissionsService.findUserPermissions.mockResolvedValue([
                {
                    permission: { name: 'sales.create' },
                    effect: PermissionEffect.DENY,
                },
                {
                    permission: { name: 'users.create' },
                    effect: PermissionEffect.ALLOW,
                },
            ]);

            const result = await service.getUserPermissions('user-1');

            expect(result.permissions).toContain('users.view');
            expect(result.permissions).toContain('users.create');
            expect(result.permissions).not.toContain('sales.create');
        });
    });
});
