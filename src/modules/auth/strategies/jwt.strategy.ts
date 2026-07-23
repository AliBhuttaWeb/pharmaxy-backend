import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma/prisma.service';
import { MESSAGES } from '@/common/constants/messages.constants';
import { ConfigService } from '@nestjs/config';
import { SessionTokenPayload } from '../types/session-token-payload.type';
import { AuthenticatedUser } from '../types';
import { AuthService } from '../services/auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        private readonly prisma: PrismaService,
        private readonly config: ConfigService,
        private readonly authService: AuthService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

            ignoreExpiration: false,

            secretOrKey: config.getOrThrow('jwt.accessSecret'),
        });
    }

    async validate(payload: SessionTokenPayload): Promise<AuthenticatedUser> {
        return this.authService.validateAccessToken(payload);
    }
}
