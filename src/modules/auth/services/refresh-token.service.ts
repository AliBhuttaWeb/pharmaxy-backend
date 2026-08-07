import { Injectable } from '@nestjs/common';
import { RefreshTokenRevocationReason } from '@gen/prisma/client';
import { createHash } from 'node:crypto';
import { SessionMetadata } from '../types';
import { RefreshTokenRecord } from '../types';
import { RefreshTokenRepository } from '../repositories/refresh-token.repository';

@Injectable()
export class RefreshTokenService {
    constructor(private readonly refreshTokenRepository: RefreshTokenRepository) {}

    private hashRefreshToken(refreshToken: string): string {
        return createHash('sha256').update(refreshToken).digest('hex');
    }
    async createRefreshToken(
        userId: string,
        refreshToken: string,
        expiresAt: Date,
        session: SessionMetadata,
    ): Promise<void> {
        const tokenHash = this.hashRefreshToken(refreshToken);
        await this.refreshTokenRepository.createRefreshToken(userId, tokenHash, expiresAt, session);
    }
    async findRefreshToken(refreshToken: string): Promise<RefreshTokenRecord | null> {
        const tokenHash = this.hashRefreshToken(refreshToken);

        return this.refreshTokenRepository.findRefreshTokenByHash(tokenHash);
    }
    async revokeRefreshToken(
        refreshTokenId: string,
        reason: RefreshTokenRevocationReason,
    ): Promise<RefreshTokenRecord> {
        return this.refreshTokenRepository.revokeRefreshToken(refreshTokenId, reason);
    }
    async revokeAllRefreshTokens(
        userId: string,
        reason: RefreshTokenRevocationReason,
    ): Promise<void> {
        await this.refreshTokenRepository.revokeAllRefreshTokens(userId, reason);
    }

    async rotateRefreshToken(
        oldRefreshTokenId: string,
        userId: string,
        refreshToken: string,
        expiresAt: Date,
        session: SessionMetadata,
    ): Promise<void> {
        const tokenHash = this.hashRefreshToken(refreshToken);

        await this.refreshTokenRepository.rotateRefreshToken(
            oldRefreshTokenId,
            userId,
            tokenHash,
            expiresAt,
            session,
        );
    }
}
