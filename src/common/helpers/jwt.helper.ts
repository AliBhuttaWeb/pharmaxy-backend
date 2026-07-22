import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '@/modules/auth/types';

export function getTokenExpirationDate(jwtService: JwtService, token: string): Date {
    const payload = jwtService.decode(token) as JwtPayload & {
        exp: number;
    };

    return new Date(payload.exp * 1000);
}
