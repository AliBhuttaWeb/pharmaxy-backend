import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { OtpType } from '@gen/prisma/enums';
import { ConfigService } from '@nestjs/config';

import { OtpRepository } from '../repositories/otp.repository';
import { GenerateOtpDto } from '../dtos/generate-otp.dto';
import { VerifyOtpDto } from '../dtos/verify-otp.dto';
import { ResendOtpDto } from '../dtos/resend-otp.dto';
import { MESSAGES } from '../constants';
import type { GenerateOtpInput } from '@/modules/auth/types';

@Injectable()
export class OtpService {
    constructor(
        private readonly otpRepository: OtpRepository,
        private readonly config: ConfigService,
    ) {}

    private generateCode(): string {
        const length = this.config.getOrThrow<number>('otp.length');
        const min = Math.pow(10, length - 1);
        const max = Math.pow(10, length) - 1;
        return Math.floor(min + Math.random() * (max - min + 1)).toString();
    }

    private getExpireMinutes(): number {
        return this.config.getOrThrow<number>('otp.expireMinutes');
    }

    private getMaxResendPer24h(): number {
        return this.config.getOrThrow<number>('otp.maxResendPer24h');
    }

    private getMaxVerifyAttempts(): number {
        return this.config.getOrThrow<number>('otp.maxVerifyAttempts');
    }

    /**
     * Internal method: generates, hashes and saves a new OTP.
     * Expires any existing active OTPs for the same destination+type first.
     */
    async generate(input: GenerateOtpInput): Promise<{ message: string }> {
        const code = this.generateCode();
        const codeHash = await bcrypt.hash(code, 10);
        const expiresAt = new Date(Date.now() + this.getExpireMinutes() * 60 * 1000);

        // Expire all previous active OTPs for this destination+type before creating a new one.
        // Old records remain for 24h resend-count tracking.
        await this.otpRepository.expireAll(input.destination, input.type);

        await this.otpRepository.create({
            user_id: input.userId,
            destination: input.destination,
            type: input.type,
            channel: input.channel,
            code_hash: codeHash,
            expires_at: expiresAt,
        });

        // TODO: Integrate notification service to send OTP via email/SMS
        // Example:
        // await this.notificationService.send({
        //     channel: input.channel,
        //     destination: input.destination,
        //     code,
        // });

        return { message: MESSAGES.SUCCESS.OTP_SENT };
    }

    /**
     * Public-facing DTO wrapper for generate — used directly from controller.
     */
    generateFromDto(dto: GenerateOtpDto): Promise<{ message: string }> {
        return this.generate({
            destination: dto.destination,
            type: dto.type,
            channel: dto.channel,
        });
    }

    /**
     * Verify an OTP code against the destination + type.
     * Increments attempts on each try.
     * On success, marks the user's email or phone as verified.
     */
    async verify(dto: VerifyOtpDto): Promise<{ message: string }> {
        const otp = await this.otpRepository.findLatestValid(dto.destination, dto.type);

        if (!otp) {
            throw new BadRequestException(MESSAGES.ERROR.OTP_EXPIRED);
        }

        if (otp.attempts >= this.getMaxVerifyAttempts()) {
            throw new HttpException(
                MESSAGES.ERROR.MAX_ATTEMPTS_EXCEEDED,
                HttpStatus.TOO_MANY_REQUESTS,
            );
        }

        // Increment attempts before comparing so brute-force is counted even on correct guess
        await this.otpRepository.incrementAttempts(otp.id);

        const isValid = await bcrypt.compare(dto.code, otp.code_hash);

        if (!isValid) {
            throw new BadRequestException(MESSAGES.ERROR.INVALID_OTP);
        }

        await this.otpRepository.markVerified(otp.id);

        // Update user verification flags based on OTP type
        if (dto.type === OtpType.EMAIL_VERIFICATION) {
            await this.otpRepository.markEmailVerified(dto.destination);
        } else if (dto.type === OtpType.PHONE_VERIFICATION) {
            await this.otpRepository.markPhoneVerified(dto.destination);
        }

        return { message: MESSAGES.SUCCESS.OTP_VERIFIED };
    }

    /**
     * Resend a new OTP. Enforces a maximum of MAX_RESEND_PER_24H sends
     * per destination+type within a 24-hour rolling window.
     * Previous active OTPs are expired before sending the new one.
     */
    async resend(dto: ResendOtpDto): Promise<{ message: string }> {
        const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const recentCount = await this.otpRepository.countRecentByDestination(
            dto.destination,
            dto.type,
            since,
        );

        if (recentCount >= this.getMaxResendPer24h()) {
            throw new HttpException(
                MESSAGES.ERROR.RESEND_LIMIT_EXCEEDED,
                HttpStatus.TOO_MANY_REQUESTS,
            );
        }

        await this.generate({
            destination: dto.destination,
            type: dto.type,
            channel: dto.channel,
        });

        return { message: MESSAGES.SUCCESS.OTP_RESENT };
    }
}
