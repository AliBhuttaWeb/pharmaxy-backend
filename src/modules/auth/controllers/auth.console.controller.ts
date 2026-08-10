import { Body, Get, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';

import type { Request } from 'express';

import { AuthService } from '../services/auth.service';
import {
    LoginDto,
    LoginResultDto,
    ProfileDto,
    RefreshTokenDto,
    RefreshTokenResultDto,
    SignupDto,
    SignupResultDto,
} from '../dtos';
import type { AuthenticatedUser, SessionMetadata } from '../types';

import { ConsoleController, CurrentUser, Public } from '@/common/decorators';

@ConsoleController('auth')
export class AuthConsoleController {
    constructor(private readonly authService: AuthService) {}

    private buildSessionMetadata(request: Request): SessionMetadata {
        return {
            ipAddress: request.ip ?? request.socket.remoteAddress ?? null,
            userAgent: request.get('user-agent') ?? null,
            deviceName: null,
        };
    }

    @Public()
    @Post('login')
    @HttpCode(HttpStatus.OK)
    login(@Body() dto: LoginDto, @Req() request: Request): Promise<LoginResultDto> {
        return this.authService.login(dto, this.buildSessionMetadata(request));
    }

    @Public()
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    refresh(@Body() dto: RefreshTokenDto, @Req() request: Request): Promise<RefreshTokenResultDto> {
        return this.authService.refreshToken(dto, this.buildSessionMetadata(request));
    }

    @Post('logout')
    @HttpCode(HttpStatus.NO_CONTENT)
    logout(@Body() dto: RefreshTokenDto): Promise<void> {
        return this.authService.logout(dto);
    }

    @Post('logout-all')
    @HttpCode(HttpStatus.NO_CONTENT)
    logoutAll(
        @CurrentUser() user: AuthenticatedUser,
        @Body() refreshTokenDto: RefreshTokenDto,
    ): Promise<void> {
        return this.authService.logoutAll(user.id, refreshTokenDto);
    }

    @Get('me')
    me(@CurrentUser() user: AuthenticatedUser): Promise<ProfileDto> {
        return this.authService.getProfile(user);
    }

    @Public()
    @Post('signup')
    @HttpCode(HttpStatus.CREATED)
    signup(@Body() dto: SignupDto): Promise<SignupResultDto> {
        return this.authService.signup(dto);
    }
}
