import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthConsoleController } from './controllers/auth.console.controller';
import { AuthService } from './services/auth.service';

import { JwtStrategy } from '@/modules/auth/strategies/jwt.strategy';
import { PrismaModule } from '@database/prisma/prisma.module';
import { RefreshTokenService } from './services/refresh-token.service';
import { AuthRepository } from './repositories/auth.repository';
import { RefreshTokenRepository } from './repositories/refresh-token.repository';

@Module({
    imports: [
        PassportModule,
        ConfigModule,
        PrismaModule,
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                secret: config.getOrThrow('jwt.accessSecret'),
                signOptions: {
                    expiresIn: config.getOrThrow('jwt.accessTokenTtl'),
                },
            }),
        }),
    ],
    controllers: [AuthConsoleController],
    providers: [
        AuthService,
        JwtStrategy,
        RefreshTokenService,
        AuthRepository,
        RefreshTokenRepository,
    ],
    exports: [AuthService, JwtModule],
})
export class AuthModule {}
