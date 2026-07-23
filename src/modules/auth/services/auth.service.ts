import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@/database/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

import { userWithPermissionsQuery } from '../queries/user-with-permissions.query';
import type { Prisma } from '@prisma/client';
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
import { LoginDto, LoginResultDto, RefreshTokenDto, SwitchBranchDto } from '../dtos';
import { MESSAGES } from '@/common/constants';
import { RefreshTokenService } from './refresh-token.service';
import { isBranchScopedRole, isNonBranchScopedRole } from '@/common/helpers';
import { Role, Permission } from '@/common/types';
import { AUTH_FLOW_STATUS } from '../constants';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
        private readonly config: ConfigService,
        private readonly refreshTokenService: RefreshTokenService,
    ) {}

    private async findUser(
        where: Prisma.UserWhereUniqueInput,
    ): Promise<UserWithPermissions | null> {
        return this.prisma.user.findUnique({
            where,
            ...userWithPermissionsQuery,
        });
    }

    private async findUserByEmail(email: string): Promise<UserWithPermissions | null> {
        return this.findUser({ email });
    }

    private async findUserById(userId: string): Promise<UserWithPermissions | null> {
        return this.findUser({ id: userId });
    }

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

        activeBranchId: string | null,
    ): Promise<{
        accessToken: string;

        refreshToken: string;
    }> {
        const payload: SessionTokenPayload = {
            sub: userId,

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

    private buildLoginResult(
        authStatus: AuthFlowStatus,
        user: LoginUserDto,
        accessToken: string,
        refreshToken: string,
    ): LoginResultDto {
        return {
            authStatus,
            user,
            accessToken,
            refreshToken,
        };
    }

    private async updateLastLogin(userId: string): Promise<void> {
        await this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                last_login_at: new Date(),
            },
        });
    }

    private ensureUserCanAuthenticate(
        user: UserWithPermissions | null,
    ): asserts user is UserWithPermissions {
        if (!user) {
            throw new UnauthorizedException(MESSAGES.AUTH.ERROR.INVALID_CREDENTIALS);
        }

        if (user.status !== UserStatus.ACTIVE) {
            throw new UnauthorizedException(MESSAGES.AUTH.ERROR.ACCOUNT_DISABLED);
        }

        if (!user.is_email_verified) {
            throw new UnauthorizedException(MESSAGES.AUTH.ERROR.EMAIL_NOT_VERIFIED);
        }

        if (user.phone && !user.is_phone_verified) {
            throw new UnauthorizedException(MESSAGES.AUTH.ERROR.PHONE_NOT_VERIFIED);
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
            throw new UnauthorizedException(MESSAGES.AUTH.ERROR.INVALID_REFRESH_TOKEN);
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
    private getDefaultUserRole(user: UserWithPermissions): UserRole | null {
        const nonBranchRole = this.getNonBranchUserRole(user);

        if (nonBranchRole) {
            return nonBranchRole;
        }

        const branchRoles = this.getBranchScopedUserRoles(user);

        if (branchRoles.length === 1) {
            return branchRoles[0];
        }

        return null;
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

            branchId: userRole.branch_id,
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

            activeBranchId,

            roles: this.buildAuthenticatedRoles(user),

            permissions: this.getUserPermissions(user),
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

        const user = await this.findUserById(payload.sub);

        this.ensureUserCanAuthenticate(user);

        const authenticatedUser = this.buildLoginUser(user);

        const tokens = await this.createSessionTokens(user.id, payload.activeBranchId);
        await this.refreshTokenService.rotateRefreshToken(
            storedRefreshToken.id,
            user.id,
            tokens.refreshToken,
            this.getTokenExpirationDate(tokens.refreshToken),
            session,
        );

        return {
            authStatus: AUTH_FLOW_STATUS.COMPLETE,
            user: authenticatedUser,
            ...tokens,
        };
    }

    private ensureRefreshTokenIsValid(
        refreshToken: RefreshTokenRecord | null,
    ): asserts refreshToken is RefreshTokenRecord {
        if (!refreshToken) {
            throw new UnauthorizedException(MESSAGES.AUTH.ERROR.INVALID_REFRESH_TOKEN);
        }

        if (refreshToken.revoked_at) {
            throw new UnauthorizedException(MESSAGES.AUTH.ERROR.INVALID_REFRESH_TOKEN);
        }

        if (refreshToken.expires_at <= new Date()) {
            throw new UnauthorizedException(MESSAGES.AUTH.ERROR.INVALID_REFRESH_TOKEN);
        }
    }
    async login(loginDto: LoginDto, session: SessionMetadata): Promise<LoginResultDto> {
        const user = await this.findUserByEmail(loginDto.email);

        this.ensureUserCanAuthenticate(user);

        const isPasswordValid = await this.validatePassword(loginDto.password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException(MESSAGES.AUTH.ERROR.INVALID_CREDENTIALS);
        }

        const loginUser = this.buildLoginUser(user);

        const nonBranchRole = this.getNonBranchUserRole(user);

        let activeBranchId: string | null = null;

        let authStatus: AuthFlowStatus;

        if (nonBranchRole) {
            authStatus = AUTH_FLOW_STATUS.COMPLETE;
        } else {
            const branchRoles = this.getBranchScopedUserRoles(user);

            if (!branchRoles.length) {
                throw new UnauthorizedException(MESSAGES.AUTH.ERROR.NO_ROLE_ASSIGNED);
            }

            if (branchRoles.length === 1) {
                // Only one branch so make it selected
                activeBranchId = branchRoles[0].branch_id;

                authStatus = AUTH_FLOW_STATUS.COMPLETE;
            } else {
                authStatus = AUTH_FLOW_STATUS.BRANCH_SELECTION_REQUIRED;
            }
        }

        const tokens = await this.createSessionTokens(user.id, activeBranchId);

        await this.refreshTokenService.createRefreshToken(
            user.id,
            tokens.refreshToken,
            this.getTokenExpirationDate(tokens.refreshToken),
            session,
        );

        await this.updateLastLogin(user.id);

        return {
            authStatus,

            user: loginUser,

            ...tokens,
        };
    }

    async logout(refreshTokenDto: RefreshTokenDto): Promise<void> {
        const storedRefreshToken = await this.refreshTokenService.findRefreshToken(
            refreshTokenDto.refreshToken,
        );

        if (!storedRefreshToken) {
            return;
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
        const user = await this.findUserById(payload.sub);

        this.ensureUserCanAuthenticate(user);

        return this.buildAuthenticatedUser(user, payload.activeBranchId);
    }

    async switchBranch(
        userId: string,
        dto: SwitchBranchDto,
        session: SessionMetadata,
    ): Promise<LoginResultDto> {
        const user = await this.findUserById(userId);

        this.ensureUserCanAuthenticate(user);

        const hasBranchAccess = user.user_roles.some(
            (userRole) =>
                userRole.branch_id === dto.branchId &&
                isBranchScopedRole(userRole.role.name as Role),
        );

        if (!hasBranchAccess) {
            throw new ForbiddenException(MESSAGES.AUTH.ERROR.BRANCH_ACCESS_DENIED);
        }

        const loginUser = this.buildLoginUser(user);

        const tokens = await this.createSessionTokens(user.id, dto.branchId);

        await this.refreshTokenService.createRefreshToken(
            user.id,
            tokens.refreshToken,
            this.getTokenExpirationDate(tokens.refreshToken),
            session,
        );

        return {
            authStatus: AUTH_FLOW_STATUS.COMPLETE,

            user: loginUser,

            ...tokens,
        };
    }
}
