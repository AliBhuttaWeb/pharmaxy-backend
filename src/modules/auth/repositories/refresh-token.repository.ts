import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma/prisma.service';
import { RefreshTokenRevocationReason } from '@gen/prisma/client';
import { RefreshTokenRecord, SessionMetadata } from '../types';

@Injectable()
export class RefreshTokenRepository {
    constructor(private readonly prisma: PrismaService) {}

    async createRefreshToken(
        userId: string,
        tokenHash: string,
        expiresAt: Date,
        session: SessionMetadata,
    ): Promise<void> {
        await this.prisma.refreshToken.create({
            data: {
                user_id: userId,
                token_hash: tokenHash,
                expires_at: expiresAt,
                device_name: session.deviceName,
                ip_address: session.ipAddress,
                user_agent: session.userAgent,
            },
        });
    }

    async findRefreshTokenByHash(tokenHash: string): Promise<RefreshTokenRecord | null> {
        return this.prisma.refreshToken.findUnique({
            where: {
                token_hash: tokenHash,
            },
        });
    }

    async revokeRefreshToken(
        refreshTokenId: string,
        reason: RefreshTokenRevocationReason,
    ): Promise<RefreshTokenRecord> {
        return this.prisma.refreshToken.update({
            where: {
                id: refreshTokenId,
            },
            data: {
                revoked_at: new Date(),
                revoked_reason: reason,
            },
        });
    }

    async revokeAllRefreshTokens(
        userId: string,
        reason: RefreshTokenRevocationReason,
    ): Promise<void> {
        await this.prisma.refreshToken.updateMany({
            where: {
                user_id: userId,
                revoked_at: null,
            },
            data: {
                revoked_at: new Date(),
                revoked_reason: reason,
            },
        });
    }

    async rotateRefreshToken(
        oldRefreshTokenId: string,
        userId: string,
        tokenHash: string,
        expiresAt: Date,
        session: SessionMetadata,
    ): Promise<void> {
        await this.prisma.$transaction(async (tx) => {
            await tx.refreshToken.update({
                where: {
                    id: oldRefreshTokenId,
                },
                data: {
                    revoked_at: new Date(),
                    revoked_reason: RefreshTokenRevocationReason.ROTATED,
                },
            });

            await tx.refreshToken.create({
                data: {
                    user_id: userId,
                    token_hash: tokenHash,
                    expires_at: expiresAt,
                    device_name: session.deviceName,
                    ip_address: session.ipAddress,
                    user_agent: session.userAgent,
                },
            });
        });
    }
}
