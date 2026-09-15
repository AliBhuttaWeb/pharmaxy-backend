import {
    BadRequestException,
    ForbiddenException,
    NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { MESSAGES } from '../constants';
import { RoleScope, UserStatus } from '@gen/prisma/enums';
import { ROLES } from '@/common/constants';
import { AuthenticatedUser } from '@/modules/auth/types';

describe('UsersService', () => {
    let service: UsersService;
    let mockUsersRepository: any;
    let mockSubscriptionConstraintService: any;
    let mockUserBranchesRepository: any;
    let mockPrismaService: any;
    let mockPermissionsService: any;
    let mockRolesService: any;

    const mockSuperAdminUser: AuthenticatedUser = {
        id: 'admin-id',
        email: 'admin@test.com',
        phone: null,
        first_name: 'Super',
        last_name: 'Admin',
        status: UserStatus.ACTIVE,
        pharmacy_id: null,
        branch_id: null,
        is_email_verified: true,
        is_phone_verified: false,
        roles: [
            {
                id: 'r1',
                name: ROLES.SUPER_ADMIN.name,
                role_scope: RoleScope.GLOBAL,
                signup_scope: null,
            },
        ],
    };

    const mockBranchAdminUser: AuthenticatedUser = {
        id: 'pharmacy-admin-id',
        email: 'pharmacy@test.com',
        phone: null,
        first_name: 'Pharmacy',
        last_name: 'Admin',
        status: UserStatus.ACTIVE,
        pharmacy_id: 'pharmacy-1',
        branch_id: 'branch-1',
        is_email_verified: true,
        is_phone_verified: false,
        roles: [
            {
                id: 'r2',
                name: ROLES.PHARMACY_ADMIN.name,
                role_scope: RoleScope.PHARMACY,
                signup_scope: null,
            },
        ],
    };

    beforeEach(() => {
        mockUsersRepository = {
            findByEmail: jest.fn().mockResolvedValue(null),
            findByPhone: jest.fn().mockResolvedValue(null),
            findById: jest.fn(),
            findMany: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            createUserRole: jest.fn(),
            deleteUserRoles: jest.fn(),
        };

        mockSubscriptionConstraintService = {
            validateUserLimit: jest.fn().mockResolvedValue(undefined),
        };

        mockUserBranchesRepository = {
            countByBranchId: jest.fn().mockResolvedValue(1),
            create: jest.fn().mockResolvedValue({ id: 'ub-1' }),
        };

        mockPrismaService = {
            $transaction: jest.fn().mockImplementation((cb) => cb({})),
        };

        mockPermissionsService = {
            syncUserPermissionOverrides: jest.fn().mockResolvedValue(undefined),
        };

        mockRolesService = {
            findById: jest.fn(),
            isChildRole: jest.fn().mockResolvedValue(true),
        };

        service = new UsersService(
            mockUsersRepository,
            mockSubscriptionConstraintService,
            mockUserBranchesRepository,
            mockPrismaService,
            mockPermissionsService,
            mockRolesService,
        );
    });

    describe('create', () => {
        const createDto = {
            first_name: 'John',
            last_name: 'Doe',
            email: 'john@example.com',
            password: 'password123',
            role_scope: RoleScope.BRANCH,
            role_id: 'role-cashier-id',
            pharmacy_id: 'pharmacy-1',
            branch_id: 'branch-1',
            permission_ids: ['perm-1', 'perm-2'],
            permissions_modified: true,
        };

        it('should throw NotFoundException if role does not exist', async () => {
            mockRolesService.findById.mockResolvedValue(null);

            await expect(service.create(createDto, mockBranchAdminUser)).rejects.toThrow(
                new NotFoundException(MESSAGES.ERROR.ROLE_NOT_FOUND),
            );
        });

        it('should throw ForbiddenException if role is not a child of creator role', async () => {
            mockRolesService.findById.mockResolvedValue({
                id: 'role-super-id',
                name: ROLES.SUPER_ADMIN.name,
                role_scope: RoleScope.GLOBAL,
            });
            mockRolesService.isChildRole.mockResolvedValue(false);

            await expect(service.create(createDto, mockBranchAdminUser)).rejects.toThrow(
                new ForbiddenException(MESSAGES.ERROR.ROLE_MUST_BE_CHILD),
            );
        });

        it('should throw BadRequestException if role_scope does not match role (e.g. assigning GLOBAL role to BRANCH user)', async () => {
            mockRolesService.findById.mockResolvedValue({
                id: 'role-supplier-id',
                name: ROLES.SUPPLIER.name,
                role_scope: RoleScope.GLOBAL,
            });
            mockRolesService.isChildRole.mockResolvedValue(true);

            await expect(service.create(createDto, mockBranchAdminUser)).rejects.toThrow(
                new BadRequestException(MESSAGES.ERROR.ROLE_SCOPE_MISMATCH),
            );
        });

        it('should create user, assign role, and sync permission overrides when valid', async () => {
            mockRolesService.findById.mockResolvedValue({
                id: 'role-cashier-id',
                name: ROLES.CASHIER.name,
                role_scope: RoleScope.BRANCH,
            });

            const createdUser = {
                id: 'user-new-id',
                first_name: 'John',
                email: 'john@example.com',
                user_roles: [{ role_id: 'role-cashier-id' }],
                user_branches: [{ branch_id: 'branch-1' }],
            };

            mockUsersRepository.create.mockResolvedValue(createdUser);
            mockUsersRepository.findById.mockResolvedValue(createdUser);

            const result = await service.create(createDto, mockBranchAdminUser);

            expect(mockUsersRepository.createUserRole).toHaveBeenCalledWith(
                createdUser.id,
                createDto.role_id,
                expect.anything(),
            );
            expect(mockPermissionsService.syncUserPermissionOverrides).toHaveBeenCalledWith(
                createdUser.id,
                [createDto.role_id],
                createDto.permission_ids,
                true,
            );
            expect(result.user).toEqual(createdUser);
            expect(result.message).toBe(MESSAGES.SUCCESS.CREATED);
        });

        it('should not mark permissions as modified if permissions_modified is not passed or false', async () => {
            const dtoWithoutPerms = {
                ...createDto,
                permissions_modified: false,
            };

            mockRolesService.findById.mockResolvedValue({
                id: 'role-cashier-id',
                name: ROLES.CASHIER.name,
                role_scope: RoleScope.BRANCH,
            });

            const createdUser = { id: 'user-new-id' };
            mockUsersRepository.create.mockResolvedValue(createdUser);
            mockUsersRepository.findById.mockResolvedValue(createdUser);

            await service.create(dtoWithoutPerms, mockBranchAdminUser);

            expect(mockPermissionsService.syncUserPermissionOverrides).toHaveBeenCalledWith(
                createdUser.id,
                [dtoWithoutPerms.role_id],
                dtoWithoutPerms.permission_ids,
                false,
            );
        });
    });

    describe('update', () => {
        const existingUser = {
            id: 'user-1',
            email: 'existing@test.com',
            phone: '1234567890',
            user_roles: [{ role_id: 'old-role-id' }],
        };

        it('should throw NotFoundException if user does not exist', async () => {
            mockUsersRepository.findById.mockResolvedValue(null);

            await expect(service.update('user-1', { first_name: 'Jane' })).rejects.toThrow(
                new NotFoundException(MESSAGES.ERROR.NOT_FOUND),
            );
        });

        it('should sync permissions when permissions_modified is true in update', async () => {
            mockUsersRepository.findById.mockResolvedValue(existingUser);
            mockUsersRepository.update.mockResolvedValue({ ...existingUser, first_name: 'Jane' });

            const result = await service.update('user-1', {
                first_name: 'Jane',
                permission_ids: ['perm-1'],
                permissions_modified: true,
            });

            expect(mockPermissionsService.syncUserPermissionOverrides).toHaveBeenCalledWith(
                'user-1',
                ['old-role-id'],
                ['perm-1'],
                true,
            );
            expect(result.message).toBe(MESSAGES.SUCCESS.UPDATED);
        });

        it('should not call syncUserPermissionOverrides when permissions_modified is false in update', async () => {
            mockUsersRepository.findById.mockResolvedValue(existingUser);
            mockUsersRepository.update.mockResolvedValue({ ...existingUser, first_name: 'Jane' });

            await service.update('user-1', { first_name: 'Jane', permissions_modified: false });

            expect(mockPermissionsService.syncUserPermissionOverrides).not.toHaveBeenCalled();
        });

        it('should reassign role and sync permissions when role_id and permissions_modified are updated', async () => {
            mockUsersRepository.findById.mockResolvedValue(existingUser);
            mockRolesService.findById.mockResolvedValue({ id: 'new-role-id', name: 'Pharmacist' });
            mockUsersRepository.update.mockResolvedValue({ ...existingUser, first_name: 'Jane' });

            await service.update('user-1', {
                role_id: 'new-role-id',
                permission_ids: ['perm-2'],
                permissions_modified: true,
            });

            expect(mockUsersRepository.deleteUserRoles).toHaveBeenCalledWith('user-1', expect.anything());
            expect(mockUsersRepository.createUserRole).toHaveBeenCalledWith(
                'user-1',
                'new-role-id',
                expect.anything(),
            );
            expect(mockPermissionsService.syncUserPermissionOverrides).toHaveBeenCalledWith(
                'user-1',
                ['new-role-id'],
                ['perm-2'],
                true,
            );
        });

        it('should throw ForbiddenException if updated role is not a child of creator role', async () => {
            mockUsersRepository.findById.mockResolvedValue(existingUser);
            mockRolesService.findById.mockResolvedValue({ id: 'new-role-id', name: 'Super Admin' });
            mockRolesService.isChildRole.mockResolvedValue(false);

            await expect(
                service.update(
                    'user-1',
                    { role_id: 'new-role-id' },
                    mockBranchAdminUser,
                ),
            ).rejects.toThrow(new ForbiddenException(MESSAGES.ERROR.ROLE_MUST_BE_CHILD));
        });
    });
});

