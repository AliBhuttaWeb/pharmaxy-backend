import { JwtService } from '@nestjs/jwt';
import { SessionTokenPayload } from '@/modules/auth/types';

export function getTokenExpirationDate(jwtService: JwtService, token: string): Date {
    const payload = jwtService.decode(token) as SessionTokenPayload & {
        exp: number;
    };

    return new Date(payload.exp * 1000);
}
