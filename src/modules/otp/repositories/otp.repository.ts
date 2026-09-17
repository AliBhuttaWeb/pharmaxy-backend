import { Injectable } from '@nestjs/common';
import { OtpChannel, OtpType, Prisma } from '@gen/prisma/client';

import { PrismaService } from '@/database/prisma/prisma.service';

@Injectable()
export class OtpRepository {
    constructor(private readonly prisma: PrismaService) {}

    create(
        data: {
            user_id: string;
            destination: string;
            type: OtpType;
            channel: OtpChannel;
            code_hash: string;
            expires_at: Date;
        },
        tx?: Prisma.TransactionClient,
    ) {
        return this.prisma.getClient(tx).otp.create({ data });
    }

    /**
     * Find the most recent unexpired, unverified OTP for a user+destination+type.
     */
    findLatestValid(
        userId: string,
        destination: string,
        type: OtpType,
        tx?: Prisma.TransactionClient,
    ) {
        return this.prisma.getClient(tx).otp.findFirst({
            where: {
                user_id: userId,
                destination,
                type,
                expires_at: { gt: new Date() },
                verified_at: null,
            },
            orderBy: { created_at: 'desc' },
        });
    }

    /**
     * Find the most recent OTP for user+destination+type regardless of expiry or verification status.
     * Used by resend to verify that an OTP was previously requested for this exact user and destination.
     */
    findLatestAny(
        userId: string,
        destination: string,
        type: OtpType,
        tx?: Prisma.TransactionClient,
    ) {
        return this.prisma.getClient(tx).otp.findFirst({
            where: {
                user_id: userId,
                destination,
                type,
            },
            orderBy: { created_at: 'desc' },
        });
    }

    /**
     * Expire all active (unexpired + unverified) OTPs for user+destination+type
     * by setting expires_at = now(). Records are kept for 24h resend counting.
     */
    async expireAll(
        userId: string,
        destination: string,
        type: OtpType,
        tx?: Prisma.TransactionClient,
    ) {
        await this.prisma.getClient(tx).otp.updateMany({
            where: {
                user_id: userId,
                destination,
                type,
                expires_at: { gt: new Date() },
                verified_at: null,
            },
            data: { expires_at: new Date() },
        });
    }

    /**
     * Count how many OTPs were created for user+destination+type since `since` date.
     * Used to enforce the max-resend-per-24h limit.
     */
    countRecentByDestination(
        userId: string,
        destination: string,
        type: OtpType,
        since: Date,
        tx?: Prisma.TransactionClient,
    ): Promise<number> {
        return this.prisma.getClient(tx).otp.count({
            where: {
                user_id: userId,
                destination,
                type,
                created_at: { gte: since },
            },
        });
    }

    async markVerified(id: string, tx?: Prisma.TransactionClient) {
        await this.prisma.getClient(tx).otp.update({
            where: { id },
            data: { verified_at: new Date() },
        });
    }

    async incrementAttempts(id: string, tx?: Prisma.TransactionClient) {
        await this.prisma.getClient(tx).otp.update({
            where: { id },
            data: { attempts: { increment: 1 } },
        });
    }
}
