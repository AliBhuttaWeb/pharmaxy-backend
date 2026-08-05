import { Role } from '@prisma/client';

export interface SessionTokenPayload {
    sub: string;
    // pharmacyId: string | null;
    activeBranchId: string | null;
    // roles: Role[];
}
