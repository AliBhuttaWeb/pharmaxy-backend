import { NotFoundException } from '@nestjs/common';
import { RolesService } from './roles.service';
import { MESSAGES } from '../constants/messages.constants';
import { RoleScope } from '@gen/prisma/enums';

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
        };

        service = new RolesService(mockRolesRepository);
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

            expect(result.role_permissions).toEqual([perm1, perm2]);
            expect(result.permissions).toEqual([perm1, perm2]);
            expect(result.child_permissions).toEqual([perm2, perm3]);
            expect(result.child_roles).toEqual([
                {
                    id: 'child-role-1',
                    name: 'Cashier',
                    description: 'Cashier role',
                    role_scope: RoleScope.BRANCH,
                    signup_scope: null,
                    parent_id: 'parent-role-id',
                    permissions: [perm2, perm3],
                },
            ]);
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

            expect(result.role_permissions).toEqual([perm1]);
            expect(result.child_permissions).toEqual([]);
            expect(result.child_roles).toEqual([]);
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
});
