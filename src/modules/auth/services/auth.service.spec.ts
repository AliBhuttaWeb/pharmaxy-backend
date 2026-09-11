import { UnauthorizedException, ConflictException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthenticatedUser } from '../types';
import { MESSAGES } from '../constants';

describe('AuthService - updateProfile', () => {
    let service: AuthService;
    let mockJwtService: any;
    let mockConfigService: any;
    let mockAuthRepo: any;
    let mockRefreshTokenService: any;
    let mockRoleService: any;

    const mockUser: AuthenticatedUser = {
        id: 'user-1',
        email: 'test@example.com',
        phone: '+923001111111',
        first_name: 'John',
        last_name: 'Doe',
        status: 'ACTIVE' as any,
        pharmacy_id: 'pharmacy-1',
        branch_id: 'branch-1',
        is_email_verified: true,
        is_phone_verified: true,
        roles: [{ id: 'role-1', name: 'Cashier' } as any],
    };

    const mockDbUser = {
        ...mockUser,
        password: 'hashed-password',
        user_roles: [{ role: { id: 'role-1', name: 'Cashier' } }],
        user_branches: [{ branch: { id: 'branch-1' } }],
    };

    beforeEach(() => {
        mockJwtService = {};
        mockConfigService = { get: jest.fn() };
        mockAuthRepo = {
            findUserById: jest.fn(),
            findUserByPhone: jest.fn(),
            updateUserProfile: jest.fn(),
        };
        mockRefreshTokenService = {};
        mockRoleService = {};

        service = new AuthService(
            mockJwtService,
            mockConfigService,
            mockRefreshTokenService,
            mockAuthRepo,
            mockRoleService,
        );
    });

    it('should throw UnauthorizedException if user is not found in database', async () => {
        mockAuthRepo.findUserById.mockResolvedValue(null);

        await expect(service.updateProfile(mockUser, { first_name: 'Jane' })).rejects.toThrow(
            UnauthorizedException,
        );
    });

    it('should throw ConflictException if new phone number is already registered', async () => {
        mockAuthRepo.findUserById.mockResolvedValue(mockDbUser);
        mockAuthRepo.findUserByPhone.mockResolvedValue({ id: 'other-user' });

        await expect(
            service.updateProfile(mockUser, { phone: '+923009999999' }),
        ).rejects.toThrow(ConflictException);
    });

    it('should successfully update profile and return { profile, message }', async () => {
        mockAuthRepo.findUserById.mockResolvedValue(mockDbUser);
        const updatedDbUser = {
            ...mockDbUser,
            first_name: 'Jane',
            last_name: 'Smith',
        };
        mockAuthRepo.updateUserProfile.mockResolvedValue(updatedDbUser);

        const result = await service.updateProfile(mockUser, {
            first_name: 'Jane',
            last_name: 'Smith',
        });

        expect(mockAuthRepo.updateUserProfile).toHaveBeenCalledWith('user-1', {
            first_name: 'Jane',
            last_name: 'Smith',
        });
        expect(result.message).toBe(MESSAGES.SUCCESS.PROFILE_UPDATED);
        expect(result.profile.first_name).toBe('Jane');
        expect(result.profile.last_name).toBe('Smith');
    });
});
