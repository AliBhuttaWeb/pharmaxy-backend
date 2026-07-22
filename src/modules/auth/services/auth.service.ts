import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@/database/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

import { userWithPermissionsQuery } from '../queries/user-with-permissions.query';
import type { Prisma } from '@prisma/client';
import {
    AuthenticatedUser,
    JwtPayload,
    RefreshTokenRecord,
    SessionMetadata,
    TokenPair,
    UserWithPermissions,
} from '../types';
import { PermissionEffect, RefreshTokenRevocationReason, UserStatus } from '@prisma/client';
import { LoginDto, LoginResultDto, RefreshTokenDto } from '../dtos';
import { MESSAGES } from '@/common/constants/messages.constants';
import { RefreshTokenService } from './refresh-token.service';

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

    private buildAuthenticatedUser(user: UserWithPermissions): AuthenticatedUser {
        return {
            id: user.id,

            email: user.email,

            firstName: user.first_name,

            lastName: user.last_name,

            status: user.status,

            roles: this.extractRoles(user),

            permissions: this.extractPermissions(user),
        };
    }

    private async generateTokenPair(user: AuthenticatedUser): Promise<TokenPair> {
        const payload: JwtPayload = { sub: user.id };

        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.config.getOrThrow('jwt.accessSecret'),
                expiresIn: this.config.getOrThrow('jwt.accessTokenTtl'),
            }),

            this.jwtService.signAsync(payload, {
                secret: this.config.getOrThrow('jwt.refreshSecret'),
                expiresIn: this.config.getOrThrow('jwt.refreshTokenTtl'),
            }),
        ]);

        return {
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

    private async verifyRefreshTokenJwt(refreshToken: string): Promise<JwtPayload> {
        try {
            return await this.jwtService.verifyAsync<JwtPayload>(refreshToken, {
                secret: this.config.getOrThrow('jwt.refreshSecret'),
            });
        } catch {
            throw new UnauthorizedException(MESSAGES.AUTH.ERROR.INVALID_REFRESH_TOKEN);
        }
    }

    private getTokenExpirationDate(token: string): Date {
        const payload = this.jwtService.decode(token) as JwtPayload & {
            exp: number;
        };

        return new Date(payload.exp * 1000);
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

        const authenticatedUser = this.buildAuthenticatedUser(user);

        const tokens = await this.generateTokenPair(authenticatedUser);

        await this.refreshTokenService.rotateRefreshToken(
            storedRefreshToken.id,
            user.id,
            tokens.refreshToken,
            this.getTokenExpirationDate(tokens.refreshToken),
            session,
        );

        return {
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

        const authenticatedUser = this.buildAuthenticatedUser(user);

        const tokens = await this.generateTokenPair(authenticatedUser);

        await this.refreshTokenService.createRefreshToken(
            user.id,
            tokens.refreshToken,
            this.getTokenExpirationDate(tokens.refreshToken),
            session,
        );

        await this.updateLastLogin(user.id);

        return {
            user: authenticatedUser,
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

    async validateAccessToken(userId: string): Promise<AuthenticatedUser> {
        const user = await this.findUserById(userId);

        this.ensureUserCanAuthenticate(user);

        return this.buildAuthenticatedUser(user);
    }
}
