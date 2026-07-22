import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';

import { JwtStrategy } from '@/modules/auth/strategies/jwt.strategy';
import { PrismaModule } from '@database/prisma/prisma.module';
import { RefreshTokenService } from './services/refresh-token.service';

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
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, RefreshTokenService],
    exports: [AuthService, JwtModule],
})
export class AuthModule {}
