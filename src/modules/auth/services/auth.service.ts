import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

import {
    AuthenticatedRole,
    AuthenticatedUser,
    AuthFlowStatus,
    LoginUserDto,
    RefreshTokenRecord,
    SessionMetadata,
    SessionTokenPayload,
    UserRole,
    UserWithPermissions,
} from '../types';
import { PermissionEffect, RefreshTokenRevocationReason, UserStatus } from '@prisma/client';
import {
    AuthContextDto,
    BranchContextDto,
    LoginDto,
    LoginResultDto,
    PharmacyContextDto,
    RefreshTokenDto,
    SwitchBranchDto,
} from '../dtos';
import { MESSAGES } from '../constants';
import { RefreshTokenService } from './refresh-token.service';
import {
    isBranchScopedRole,
    isNonBranchScopedRole,
    isPharmacyAdmin,
    isSuperAdmin,
} from '@/common/helpers';
import { Role, Permission } from '@/common/types';
import { AUTH_FLOW_STATUS } from '../constants';
import { AuthRepository } from '../repositories/auth.repository';
import { BranchesService } from '@/modules/branches/services/branches.service';
import { PharmaciesService } from '@/modules/pharmacies/services/pharmacies.services';
import { MESSAGES as BRANCH_MESSAGES } from '@modules/branches/constants';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly config: ConfigService,
        private readonly refreshTokenService: RefreshTokenService,
        private readonly authRepository: AuthRepository,
        private readonly branchesService: BranchesService,
        private readonly pharmacesService: PharmaciesService,
    ) {}

    private extractRoles(user: UserWithPermissions): string[] {
        return user.user_roles.map(({ role }) => role.name);
    }

    private extractPermissions(user: UserWithPermissions): string[] {
        const permissions = new Set<string>();

        // Permissions inherited from roles
        for (const { role } of user.user_roles) {
            for (const { permission } of role.role_permissions) {
                permissions.add(permission.name);
            }
        }

        // User-specific permission overrides
        for (const userPermission of user.user_permissions) {
            const permissionName = userPermission.permission.name;

            switch (userPermission.effect) {
                case PermissionEffect.ALLOW:
                    permissions.add(permissionName);
                    break;

                case PermissionEffect.DENY:
                    permissions.delete(permissionName);
                    break;
            }
        }

        return [...permissions];
    }

    private buildLoginUser(user: UserWithPermissions): LoginUserDto {
        return {
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            status: user.status,
        };
    }

    private async generateAccessToken(payload: SessionTokenPayload): Promise<string> {
        return this.jwtService.signAsync(payload, {
            secret: this.config.getOrThrow('jwt.accessSecret'),
            expiresIn: this.config.getOrThrow('jwt.accessTokenTtl'),
        });
    }

    private async generateRefreshToken(payload: SessionTokenPayload): Promise<string> {
        return this.jwtService.signAsync(payload, {
            secret: this.config.getOrThrow('jwt.refreshSecret'),
            expiresIn: this.config.getOrThrow('jwt.refreshTokenTtl'),
        });
    }

    private async createSessionTokens(
        userId: string,
        pharmacyId: string | null,
        activeBranchId: string | null,
    ): Promise<{
        accessToken: string;
        refreshToken: string;
    }> {
        const payload: SessionTokenPayload = {
            sub: userId,
            pharmacyId,
            activeBranchId,
        };

        const [accessToken, refreshToken] = await Promise.all([
            this.generateAccessToken(payload),
            this.generateRefreshToken(payload),
        ]);

        return {
            accessToken,
            refreshToken,
        };
    }

    private async updateLastLogin(userId: string): Promise<void> {
        await this.authRepository.updateLastLogin(userId);
    }

    private ensureUserCanAuthenticate(
        user: UserWithPermissions | null,
    ): asserts user is UserWithPermissions {
        if (!user) {
            throw new UnauthorizedException(MESSAGES.ERROR.INVALID_CREDENTIALS);
        }

        if (user.status !== UserStatus.ACTIVE) {
            throw new UnauthorizedException(MESSAGES.ERROR.ACCOUNT_DISABLED);
        }

        if (!user.is_email_verified) {
            throw new UnauthorizedException(MESSAGES.ERROR.EMAIL_NOT_VERIFIED);
        }

        if (user.phone && !user.is_phone_verified) {
            throw new UnauthorizedException(MESSAGES.ERROR.PHONE_NOT_VERIFIED);
        }
    }

    private async validatePassword(
        plainPassword: string,
        hashedPassword: string,
    ): Promise<boolean> {
        return bcrypt.compare(plainPassword, hashedPassword);
    }

    private async verifyRefreshTokenJwt(refreshToken: string): Promise<SessionTokenPayload> {
        try {
            return await this.jwtService.verifyAsync<SessionTokenPayload>(refreshToken, {
                secret: this.config.getOrThrow('jwt.refreshSecret'),
            });
        } catch {
            throw new UnauthorizedException(MESSAGES.ERROR.INVALID_REFRESH_TOKEN);
        }
    }

    private getTokenExpirationDate(token: string): Date {
        const payload = this.jwtService.decode(token) as SessionTokenPayload & {
            exp: number;
        };

        return new Date(payload.exp * 1000);
    }

    private getNonBranchUserRole(user: UserWithPermissions): UserRole | null {
        return user.user_roles.find(({ role }) => isNonBranchScopedRole(role.name as Role)) ?? null;
    }

    private getBranchScopedUserRoles(user: UserWithPermissions): UserRole[] {
        return user.user_roles.filter(({ role }) => isBranchScopedRole(role.name as Role));
    }

    private getUserPermissions(user: UserWithPermissions): Permission[] {
        const rolePermissions = user.user_roles.flatMap(({ role }) =>
            role.role_permissions.map(({ permission }) => permission.name as Permission),
        );

        const directPermissions = user.user_permissions.map(
            ({ permission }) => permission.name as Permission,
        );

        return [...new Set([...rolePermissions, ...directPermissions])];
    }

    private buildAuthenticatedRoles(user: UserWithPermissions): AuthenticatedRole[] {
        return user.user_roles.map((userRole) => ({
            id: userRole.id,
            name: userRole.role.name as Role,
        }));
    }

    private buildAuthenticatedUser(
        user: UserWithPermissions,
        activeBranchId: string | null,
    ): AuthenticatedUser {
        return {
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            status: user.status,
            pharmacyId: user.pharmacy_id,
            activeBranchId,
            roles: this.buildAuthenticatedRoles(user),
            permissions: this.getUserPermissions(user),
        };
    }

    async getAuthContext(userId: string, activeBranchId: string | null): Promise<AuthContextDto> {
        const user = await this.authRepository.findUserById(userId);
        this.ensureUserCanAuthenticate(user);

        const roles = this.buildAuthenticatedRoles(user);
        const permissions = this.getUserPermissions(user);
        const pharmacyId = user.pharmacy_id;

        let pharmacyDto: PharmacyContextDto | null = null;
        let availableBranchesDto: BranchContextDto[] = [];
        let activeBranchDto: BranchContextDto | null = null;

        if (pharmacyId) {
            const [pharmacy, availableBranches] = await Promise.all([
                this.pharmacesService.findById(pharmacyId),
                this.branchesService.findAvailableForUser(userId),
            ]);

            if (pharmacy) {
                pharmacyDto = pharmacy;
            }

            availableBranchesDto = availableBranches.map((b) => b);
        }

        if (activeBranchId) {
            const activeBranch = await this.branchesService.findById(activeBranchId);
            if (activeBranch) {
                activeBranchDto = activeBranch;
            }
        }

        return {
            pharmacy: pharmacyDto,
            activeBranch: activeBranchDto,
            availableBranches: availableBranchesDto,
            roles,
            permissions,
        };
    }

    async refreshToken(
        refreshTokenDto: RefreshTokenDto,
        session: SessionMetadata,
    ): Promise<LoginResultDto> {
        const payload = await this.verifyRefreshTokenJwt(refreshTokenDto.refreshToken);

        const storedRefreshToken = await this.refreshTokenService.findRefreshToken(
            refreshTokenDto.refreshToken,
        );

        this.ensureRefreshTokenIsValid(storedRefreshToken);

        const user = await this.authRepository.findUserById(payload.sub);

        this.ensureUserCanAuthenticate(user);

        const authenticatedUser = this.buildLoginUser(user);
        const pharmacyId = user.pharmacy_id;

        const tokens = await this.createSessionTokens(user.id, pharmacyId, payload.activeBranchId);
        await this.refreshTokenService.rotateRefreshToken(
            storedRefreshToken.id,
            user.id,
            tokens.refreshToken,
            this.getTokenExpirationDate(tokens.refreshToken),
            session,
        );

        const context = await this.getAuthContext(user.id, payload.activeBranchId);

        return {
            authStatus: AUTH_FLOW_STATUS.COMPLETE,
            user: authenticatedUser,
            ...tokens,
            ...context,
        };
    }

    private ensureRefreshTokenIsValid(
        refreshToken: RefreshTokenRecord | null,
    ): asserts refreshToken is RefreshTokenRecord {
        if (!refreshToken) {
            throw new UnauthorizedException(MESSAGES.ERROR.INVALID_REFRESH_TOKEN);
        }

        if (refreshToken.revoked_at) {
            throw new UnauthorizedException(MESSAGES.ERROR.INVALID_REFRESH_TOKEN);
        }

        if (refreshToken.expires_at <= new Date()) {
            throw new UnauthorizedException(MESSAGES.ERROR.INVALID_REFRESH_TOKEN);
        }
    }

    async login(loginDto: LoginDto, session: SessionMetadata): Promise<LoginResultDto> {
        const user = await this.authRepository.findUserByEmail(loginDto.email);

        this.ensureUserCanAuthenticate(user);

        const isPasswordValid = await this.validatePassword(loginDto.password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException(MESSAGES.ERROR.INVALID_CREDENTIALS);
        }

        const loginUser = this.buildLoginUser(user);

        const pharmacyId = user.pharmacy_id;

        let activeBranchId: string | null = null;
        let authStatus: AuthFlowStatus;
        const roles = user.user_roles.map((userRole) => ({
            name: userRole.role.name,
        }));

        if (isSuperAdmin(roles)) {
            authStatus = AUTH_FLOW_STATUS.COMPLETE;
        } else {
            const roleNames = user.user_roles.map((userRole) => ({
                name: userRole.role.name,
            }));
            const branches = await this.branchesService.findAvailableBranchesForUser(
                user.id,
                user.pharmacy_id,
                isSuperAdmin(roleNames),
                isPharmacyAdmin(roleNames),
            );

            if (!branches.length) {
                throw new UnauthorizedException(BRANCH_MESSAGES.ERROR.NO_BRANCH_ASSIGNED);
            }

            if (branches.length === 1) {
                activeBranchId = branches[0].id;
                authStatus = AUTH_FLOW_STATUS.COMPLETE;
            } else {
                authStatus = AUTH_FLOW_STATUS.BRANCH_SELECTION_REQUIRED;
            }
        }

        const tokens = await this.createSessionTokens(user.id, pharmacyId, activeBranchId);

        await this.refreshTokenService.createRefreshToken(
            user.id,
            tokens.refreshToken,
            this.getTokenExpirationDate(tokens.refreshToken),
            session,
        );

        await this.updateLastLogin(user.id);

        const context = await this.getAuthContext(user.id, activeBranchId);

        return {
            authStatus,
            user: loginUser,
            ...tokens,
            ...context,
        };
    }

    async logout(refreshTokenDto: RefreshTokenDto): Promise<void> {
        const storedRefreshToken = await this.refreshTokenService.findRefreshToken(
            refreshTokenDto.refreshToken,
        );

        if (!storedRefreshToken) {
            throw new UnauthorizedException(MESSAGES.ERROR.SESSION_REVOKED);
        }

        if (storedRefreshToken.revoked_reason === RefreshTokenRevocationReason.ADMIN_REVOKED) {
            throw new UnauthorizedException(MESSAGES.ERROR.SESSION_REVOKED);
        }

        await this.refreshTokenService.revokeRefreshToken(
            storedRefreshToken.id,
            RefreshTokenRevocationReason.LOGOUT,
        );
    }

    async logoutAll(userId: string): Promise<void> {
        await this.refreshTokenService.revokeAllRefreshTokens(
            userId,
            RefreshTokenRevocationReason.LOGOUT,
        );
    }

    async validateAccessToken(payload: SessionTokenPayload): Promise<AuthenticatedUser> {
        const user = await this.authRepository.findUserById(payload.sub);

        this.ensureUserCanAuthenticate(user);

        return this.buildAuthenticatedUser(user, payload.activeBranchId);
    }

    async switchBranch(
        userId: string,
        dto: SwitchBranchDto,
        session: SessionMetadata,
    ): Promise<LoginResultDto> {
        const user = await this.authRepository.findUserById(userId);

        this.ensureUserCanAuthenticate(user);

        const hasBranchAccess = user.user_branches.some(
            (userBranch) => userBranch.branch_id === dto.branchId,
        );

        if (!hasBranchAccess) {
            throw new ForbiddenException(MESSAGES.ERROR.BRANCH_ACCESS_DENIED);
        }

        const loginUser = this.buildLoginUser(user);

        const pharmacyId = user.pharmacy_id;
        const tokens = await this.createSessionTokens(user.id, pharmacyId, dto.branchId);

        await this.refreshTokenService.createRefreshToken(
            user.id,
            tokens.refreshToken,
            this.getTokenExpirationDate(tokens.refreshToken),
            session,
        );

        const context = await this.getAuthContext(user.id, dto.branchId);

        return {
            authStatus: AUTH_FLOW_STATUS.COMPLETE,
            user: loginUser,
            ...tokens,
            ...context,
        };
    }
}
