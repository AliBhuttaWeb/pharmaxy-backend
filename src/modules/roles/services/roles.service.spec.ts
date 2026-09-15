import { NotFoundException } from '@nestjs/common';
import { RolesService } from './roles.service';
import { MESSAGES } from '../constants/messages.constants';
import { RoleScope } from '@gen/prisma/enums';
import { AuthenticatedUser } from '@/modules/auth/types';

describe('RolesService', () => {
    let service: RolesService;
    let mockRolesRepository: any;

    beforeEach(() => {
        mockRolesRepository = {
            findMany: jest.fn(),
            findById: jest.fn(),
            findByName: jest.fn(),
            findByIdWithPermissions: jest.fn(),
            replacePermissions: jest.fn(),
            findRoleAndDescendantsWithPermissions: jest.fn(),
            findChildRoleIds: jest.fn(),
            isChildRole: jest.fn(),
        };

        service = new RolesService(mockRolesRepository);
    });

    describe('list', () => {
        it('should list roles', async () => {
            const roles = [{ id: 'role-1', name: 'Role 1' }];
            mockRolesRepository.findMany.mockResolvedValue({ records: roles, total: 1 });

            const result = await service.list({ page: 1, limit: 10 });

            expect(mockRolesRepository.findMany).toHaveBeenCalledWith({ page: 1, limit: 10 });
            expect(result.records).toEqual(roles);
            expect(result.pagination).toBeDefined();
        });
    });

    describe('getChildRoles', () => {
        it('should return child roles of the currentUser', async () => {
            const user = {
                id: 'user-1',
                roles: [{ id: 'parent-role-id', name: 'Pharmacy Admin' }],
            } as AuthenticatedUser;

            const childRoles = [{ id: 'child-role-id', name: 'Cashier' }];
            mockRolesRepository.findChildRoleIds.mockResolvedValue(['child-role-id']);
            mockRolesRepository.findMany.mockResolvedValue({ records: childRoles, total: 1 });

            const result = await service.getChildRoles(user, { page: 1, limit: 10 });

            expect(mockRolesRepository.findChildRoleIds).toHaveBeenCalledWith(['parent-role-id']);
            expect(mockRolesRepository.findMany).toHaveBeenCalledWith(
                { page: 1, limit: 10 },
                ['child-role-id'],
            );
            expect(result.records).toEqual(childRoles);
        });
    });

    describe('findChildRoleIds', () => {
        it('should delegate to rolesRepository.findChildRoleIds', async () => {
            mockRolesRepository.findChildRoleIds.mockResolvedValue(['child-1']);

            const result = await service.findChildRoleIds(['parent-1']);
            expect(result).toEqual(['child-1']);
            expect(mockRolesRepository.findChildRoleIds).toHaveBeenCalledWith(['parent-1']);
        });
    });

    describe('get', () => {
        it('should throw NotFoundException if role not found', async () => {
            mockRolesRepository.findById.mockResolvedValue(null);

            await expect(service.get('role-1')).rejects.toThrow(
                new NotFoundException(MESSAGES.ERROR.NOT_FOUND),
            );
        });

        it('should return role when found', async () => {
            const role = { id: 'role-1', name: 'Admin' };
            mockRolesRepository.findById.mockResolvedValue(role);

            const result = await service.get('role-1');
            expect(result).toEqual({ role });
        });
    });

    describe('getPermissions', () => {
        it('should throw NotFoundException if role not found', async () => {
            mockRolesRepository.findRoleAndDescendantsWithPermissions.mockResolvedValue(null);

            await expect(service.getPermissions('role-1')).rejects.toThrow(
                new NotFoundException(MESSAGES.ERROR.NOT_FOUND),
            );
        });

        it('should return role_permissions and child_permissions as separate objects', async () => {
            const perm1 = { id: 'p1', name: 'sales.view', description: 'View sales' };
            const perm2 = { id: 'p2', name: 'pos.create', description: 'Create pos' };
            const perm3 = { id: 'p3', name: 'reports.view', description: 'View reports' };

            const role = {
                id: 'parent-role-id',
                name: 'Pharmacy Admin',
                role_scope: RoleScope.PHARMACY,
                signup_scope: null,
                parent_id: null,
                role_permissions: [
                    { permission: perm1 },
                    { permission: perm2 },
                ],
            };

            const childRole1 = {
                id: 'child-role-1',
                name: 'Cashier',
                description: 'Cashier role',
                role_scope: RoleScope.BRANCH,
                signup_scope: null,
                parent_id: 'parent-role-id',
                role_permissions: [
                    { permission: perm2 },
                    { permission: perm3 },
                ],
            };

            mockRolesRepository.findRoleAndDescendantsWithPermissions.mockResolvedValue({
                role,
                children: [childRole1],
            });

            const result = await service.getPermissions('parent-role-id');

            expect(result).toEqual({
                role_permissions: [perm1, perm2],
                child_permissions: [perm2, perm3],
            });
        });

        it('should handle role with no children gracefully', async () => {
            const perm1 = { id: 'p1', name: 'user.view' };
            const role = {
                id: 'role-leaf',
                name: 'Leaf Role',
                role_permissions: [{ permission: perm1 }],
            };

            mockRolesRepository.findRoleAndDescendantsWithPermissions.mockResolvedValue({
                role,
                children: [],
            });

            const result = await service.getPermissions('role-leaf');

            expect(result).toEqual({
                role_permissions: [perm1],
                child_permissions: [],
            });
        });
    });

    describe('replacePermissions', () => {
        it('should replace and return updated permissions', async () => {
            const perm1 = { id: 'p1', name: 'perm.1' };
            mockRolesRepository.findById.mockResolvedValue({ id: 'role-1' });
            mockRolesRepository.replacePermissions.mockResolvedValue({
                id: 'role-1',
                role_permissions: [{ permission: perm1 }],
            });

            const result = await service.replacePermissions('role-1', {
                permission_ids: ['p1'],
            });

            expect(result).toEqual({
                permissions: [perm1],
            });
            expect(mockRolesRepository.replacePermissions).toHaveBeenCalledWith('role-1', ['p1']);
        });
    });

    describe('findById', () => {
        it('should call rolesRepository.findById', async () => {
            const role = { id: 'role-1', name: 'Admin' };
            mockRolesRepository.findById.mockResolvedValue(role);

            const result = await service.findById('role-1');
            expect(result).toEqual(role);
            expect(mockRolesRepository.findById).toHaveBeenCalledWith('role-1');
        });
    });

    describe('isChildRole', () => {
        it('should delegate to rolesRepository.isChildRole', async () => {
            mockRolesRepository.isChildRole = jest.fn().mockResolvedValue(true);
            const targetRole = { id: 'r2', name: 'Cashier', parent_id: 'r1' };

            const result = await service.isChildRole(['r1'], targetRole);
            expect(result).toBe(true);
            expect(mockRolesRepository.isChildRole).toHaveBeenCalledWith(['r1'], targetRole);
        });
    });
});
