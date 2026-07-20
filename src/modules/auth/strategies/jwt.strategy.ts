import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '@/database/prisma/prisma.service';
import { MESSAGES } from '@/common/constants/messages.constants';
import { ConfigService } from '@nestjs/config';

export interface JwtPayload {
    sub: number;
    email: string;
    role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly prisma: PrismaService,
        private readonly config: ConfigService,
    ) {
        super({
            secretOrKey: config.getOrThrow('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        });
    }

    async validate(payload: JwtPayload) {
        const user = await this.prisma.user.findUnique({
            where: { id: payload.sub },
        });

        if (!user) {
            throw new UnauthorizedException(MESSAGES.AUTH.ERROR.ACCOUNT_DELETED);
        }

        return { userId: payload.sub, email: payload.email };
    }
}
