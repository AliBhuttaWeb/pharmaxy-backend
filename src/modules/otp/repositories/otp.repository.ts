import { Injectable } from '@nestjs/common';
import { OtpChannel, OtpType, Prisma } from '@gen/prisma/client';

import { PrismaService } from '@/database/prisma/prisma.service';

@Injectable()
export class OtpRepository {
    constructor(private readonly prisma: PrismaService) {}

    create(
        data: {
            user_id?: string;
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
     * Find the most recent unexpired, unverified OTP for a destination+type.
     */
    findLatestValid(destination: string, type: OtpType, tx?: Prisma.TransactionClient) {
        return this.prisma.getClient(tx).otp.findFirst({
            where: {
                destination,
                type,
                expires_at: { gt: new Date() },
                verified_at: null,
            },
            orderBy: { created_at: 'desc' },
        });
    }

    /**
     * Expire all active (unexpired + unverified) OTPs for a destination+type
     * by setting expires_at = now(). Records are kept for 24h resend counting.
     */
    async expireAll(destination: string, type: OtpType, tx?: Prisma.TransactionClient) {
        await this.prisma.getClient(tx).otp.updateMany({
            where: {
                destination,
                type,
                expires_at: { gt: new Date() },
                verified_at: null,
            },
            data: { expires_at: new Date() },
        });
    }

    /**
     * Count how many OTPs were created for destination+type since `since` date.
     * Used to enforce the max-resend-per-24h limit.
     */
    countRecentByDestination(
        destination: string,
        type: OtpType,
        since: Date,
        tx?: Prisma.TransactionClient,
    ): Promise<number> {
        return this.prisma.getClient(tx).otp.count({
            where: {
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

    /**
     * Mark a user's email as verified. Called after successful EMAIL_VERIFICATION OTP.
     */
    async markEmailVerified(email: string, tx?: Prisma.TransactionClient) {
        await this.prisma.getClient(tx).user.updateMany({
            where: { email },
            data: { is_email_verified: true },
        });
    }

    /**
     * Mark a user's phone as verified. Called after successful PHONE_VERIFICATION OTP.
     */
    async markPhoneVerified(phone: string, tx?: Prisma.TransactionClient) {
        await this.prisma.getClient(tx).user.updateMany({
            where: { phone },
            data: { is_phone_verified: true },
        });
    }
}
