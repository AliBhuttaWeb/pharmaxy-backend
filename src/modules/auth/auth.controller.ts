import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';

import { AuthService } from './services/auth.service';
import { LoginDto, LoginResultDto, RefreshTokenDto } from './dtos';
import { AuthenticatedUser, SessionMetadata } from './types';
import { CurrentUser } from '@/common/decorators';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    private buildSessionMetadata(request: Request): SessionMetadata {
        return {
            ipAddress: request.ip ?? request.socket.remoteAddress ?? null,

            userAgent: request.get('user-agent') ?? null,

            deviceName: null,
        };
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginDto: LoginDto, @Req() request: Request): Promise<LoginResultDto> {
        const session = this.buildSessionMetadata(request);

        return this.authService.login(loginDto, session);
    }

    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    async refreshToken(
        @Body() dto: RefreshTokenDto,
        @Req() request: Request,
    ): Promise<LoginResultDto> {
        const session = this.buildSessionMetadata(request);

        return this.authService.refreshToken(dto, session);
    }

    @Post('logout')
    @HttpCode(HttpStatus.NO_CONTENT)
    async logout(@Body() refreshTokenDto: RefreshTokenDto): Promise<void> {
        await this.authService.logout(refreshTokenDto);
    }

    @Post('logout-all')
    @HttpCode(HttpStatus.NO_CONTENT)
    async logoutAll(): Promise<void> {
        throw new Error('Not implemented');
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    getProfile(@CurrentUser() user: AuthenticatedUser): AuthenticatedUser {
        return user;
    }
}
