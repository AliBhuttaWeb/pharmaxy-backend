export interface SessionTokenPayload {
    sub: string;
    pharmacyId: string | null;
    activeBranchId: string | null;
}
