import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

import {
    AuthenticatedUser,
    RefreshTokenRecord,
    SessionMetadata,
    SessionTokenPayload,
    UserWithRolesAndBranchesQuery,
} from '../types';
import { RefreshTokenRevocationReason, UserStatus } from '@gen/prisma/client';
import {
    LoginDto,
    LoginResultDto,
    RefreshTokenDto,
    RefreshTokenResultDto,
    SignupDto,
    SignupResultDto,
    ProfileDto,
} from '../dtos';
import { MESSAGES } from '../constants';
import { RefreshTokenService } from './refresh-token.service';
import { AuthRepository } from '../repositories/auth.repository';
import { buildAuthenticatedUser, hashPassword } from '../helpers';
import { ensureSignupRole } from '../helpers/ensure-signup-role.helper';
import { RolesService } from './roles.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly config: ConfigService,
        private readonly refreshTokenService: RefreshTokenService,
        private readonly authRepository: AuthRepository,
        private readonly roleService: RolesService,
    ) {}

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

    private async updateLastLogin(userId: string): Promise<void> {
        await this.authRepository.updateLastLogin(userId);
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

    async refreshToken(
        refreshTokenDto: RefreshTokenDto,
        session: SessionMetadata,
    ): Promise<RefreshTokenResultDto> {
        const payload = await this.verifyRefreshTokenJwt(refreshTokenDto.refreshToken);

        const storedRefreshToken = await this.refreshTokenService.findRefreshToken(
            refreshTokenDto.refreshToken,
        );

        this.ensureRefreshTokenIsValid(storedRefreshToken);

        const user = await this.authRepository.findUserById(payload.sub);

        this.ensureUserCanAuthenticate(user);

        const tokenPayload: SessionTokenPayload = {
            sub: user.id,
        };

        const [accessToken, refreshToken] = await Promise.all([
            this.generateAccessToken(tokenPayload),
            this.generateRefreshToken(tokenPayload),
        ]);

        await this.refreshTokenService.rotateRefreshToken(
            storedRefreshToken.id,
            user.id,
            refreshToken,
            this.getTokenExpirationDate(refreshToken),
            session,
        );

        return {
            accessToken,
            refreshToken,
        };
    }

    private ensureRefreshTokenIsValid(
        refreshToken: RefreshTokenRecord | null,
    ): asserts refreshToken is RefreshTokenRecord {
        if (!refreshToken) {
            throw new UnauthorizedException(MESSAGES.ERROR.INVALID_REFRESH_TOKEN);
        }

        if (refreshToken.expires_at <= new Date()) {
            throw new UnauthorizedException(MESSAGES.ERROR.INVALID_REFRESH_TOKEN);
        }

        if (!refreshToken.revoked_at) {
            return;
        }

        switch (refreshToken.revoked_reason) {
            case RefreshTokenRevocationReason.ADMIN_REVOKED:
            case RefreshTokenRevocationReason.ACCOUNT_DISABLED:
            case RefreshTokenRevocationReason.SECURITY:
            case RefreshTokenRevocationReason.TOKEN_REUSED:
                throw new UnauthorizedException(MESSAGES.ERROR.SESSION_REVOKED);

            default:
                throw new UnauthorizedException(MESSAGES.ERROR.INVALID_REFRESH_TOKEN);
        }
    }

    private ensureUserCanAuthenticate(
        user: UserWithRolesAndBranchesQuery | null,
    ): asserts user is UserWithRolesAndBranchesQuery {
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

    async login(loginDto: LoginDto, session: SessionMetadata): Promise<LoginResultDto> {
        const user = await this.authRepository.findUserByEmail(loginDto.email);

        this.ensureUserCanAuthenticate(user);

        const isPasswordValid = await this.validatePassword(loginDto.password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException(MESSAGES.ERROR.INVALID_CREDENTIALS);
        }

        const payload: SessionTokenPayload = {
            sub: user.id,
        };

        const [accessToken, refreshToken] = await Promise.all([
            this.generateAccessToken(payload),
            this.generateRefreshToken(payload),
        ]);

        await this.refreshTokenService.createRefreshToken(
            user.id,
            refreshToken,
            this.getTokenExpirationDate(refreshToken),
            session,
        );

        await this.updateLastLogin(user.id);

        return {
            user: buildAuthenticatedUser(user),
            accessToken,
            refreshToken,
        };
    }

    async logout(refreshTokenDto: RefreshTokenDto): Promise<void> {
        const storedRefreshToken = await this.refreshTokenService.findRefreshToken(
            refreshTokenDto.refreshToken,
        );

        this.ensureRefreshTokenIsValid(storedRefreshToken);

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

    async logoutAll(userId: string, dto: RefreshTokenDto): Promise<void> {
        const storedRefreshToken = await this.refreshTokenService.findRefreshToken(
            dto.refreshToken,
        );

        this.ensureRefreshTokenIsValid(storedRefreshToken);

        await this.refreshTokenService.revokeAllRefreshTokens(
            userId,
            RefreshTokenRevocationReason.LOGOUT,
        );
    }

    async validateAccessToken(payload: SessionTokenPayload): Promise<AuthenticatedUser> {
        const user = await this.authRepository.findUserById(payload.sub);

        this.ensureUserCanAuthenticate(user);

        return buildAuthenticatedUser(user);
    }

    async getProfile(user: AuthenticatedUser): Promise<ProfileDto> {
        const dbUser = await this.authRepository.findUserById(user.id);

        if (!dbUser) {
            throw new UnauthorizedException(MESSAGES.ERROR.INVALID_CREDENTIALS);
        }

        return { profile: buildAuthenticatedUser(dbUser, user.branch_id) };
    }

    private async ensureEmailAvailable(email: string): Promise<void> {
        const exists = await this.authRepository.findUserByEmail(email);

        if (exists) {
            throw new ConflictException(MESSAGES.ERROR.EMAIL_ALREADY_EXISTS);
        }
    }

    private async ensurePhoneAvailable(phone?: string): Promise<void> {
        if (!phone) {
            return;
        }

        const exists = await this.authRepository.findUserByPhone(phone);

        if (exists) {
            throw new ConflictException(MESSAGES.ERROR.PHONE_ALREADY_EXISTS);
        }
    }

    async signup(dto: SignupDto): Promise<SignupResultDto> {
        await this.ensureEmailAvailable(dto.email);
        await this.ensurePhoneAvailable(dto.phone);

        const role = await this.roleService.findById(dto.role_id);

        ensureSignupRole(role, dto.signup_scope);

        const password = await hashPassword(dto.password);

        const user = await this.authRepository.createSignupAccount({
            ...dto,
            password,
        });

        return { user: buildAuthenticatedUser(user) };
    }
}
