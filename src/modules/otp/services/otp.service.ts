import {
    BadRequestException,
    HttpException,
    HttpStatus,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { OtpType, User, UserStatus } from '@gen/prisma/client';
import { ConfigService } from '@nestjs/config';

import { OtpRepository } from '../repositories/otp.repository';
import { UsersRepository } from '@/modules/users/repositories/users.repository';
import { GenerateOtpDto } from '../dtos/generate-otp.dto';
import { VerifyOtpDto } from '../dtos/verify-otp.dto';
import { ResendOtpDto } from '../dtos/resend-otp.dto';
import { MESSAGES } from '../constants';
import type { GenerateOtpInput } from '@/modules/auth/types';

@Injectable()
export class OtpService {
    constructor(
        private readonly otpRepository: OtpRepository,
        private readonly usersRepository: UsersRepository,
        private readonly config: ConfigService,
    ) {}

    private normalizeDestination(destination: string, type: OtpType): string {
        const trimmed = destination.trim();
        if (type === OtpType.EMAIL_VERIFICATION || type === OtpType.EMAIL_CHANGE) {
            return trimmed.toLowerCase();
        }
        return trimmed;
    }

    private getLength(): number {
        return this.config.getOrThrow<number>('otp.length');
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

    private getResendCooldownSeconds(): number {
        return this.config.get<number>('otp.resendCooldownSeconds') ?? 60;
    }

    private generateCode(): string {
        const length = this.getLength();
        const min = Math.pow(10, length - 1);
        const max = Math.pow(10, length) - 1;
        return Math.floor(min + Math.random() * (max - min + 1)).toString();
    }

    /**
     * Resolves the user associated with the destination, ensures account is active,
     * not already verified, and matches expectedUserId if provided.
     */
    private async resolveAndValidateUser(
        destination: string,
        type: OtpType,
        expectedUserId?: string,
    ): Promise<User> {
        let user: User | null = null;

        if (type === OtpType.EMAIL_VERIFICATION) {
            user = await this.usersRepository.findByEmail(destination);
            if (!user) {
                throw new NotFoundException(MESSAGES.ERROR.USER_NOT_FOUND);
            }
            if (user.status !== UserStatus.ACTIVE) {
                throw new BadRequestException(MESSAGES.ERROR.ACCOUNT_INACTIVE);
            }
            if (user.is_email_verified) {
                throw new BadRequestException(MESSAGES.ERROR.OTP_ALREADY_VERIFIED);
            }
        } else if (type === OtpType.PHONE_VERIFICATION) {
            user = await this.usersRepository.findByPhone(destination);
            if (!user) {
                throw new NotFoundException(MESSAGES.ERROR.USER_NOT_FOUND);
            }
            if (user.status !== UserStatus.ACTIVE) {
                throw new BadRequestException(MESSAGES.ERROR.ACCOUNT_INACTIVE);
            }
            if (user.is_phone_verified) {
                throw new BadRequestException(MESSAGES.ERROR.OTP_ALREADY_VERIFIED);
            }
        }

        if (!user) {
            throw new NotFoundException(MESSAGES.ERROR.USER_NOT_FOUND);
        }

        if (expectedUserId && user.id !== expectedUserId) {
            throw new BadRequestException(MESSAGES.ERROR.USER_NOT_FOUND);
        }

        return user;
    }

    /**
     * Internal method: generates, hashes and saves a new OTP bound to the user.
     * Expires any existing active OTPs for the same user+destination+type first.
     */
    async generate(input: GenerateOtpInput): Promise<{ message: string }> {
        const destination = this.normalizeDestination(input.destination, input.type);

        // 1. Resolve user and check account is active & unverified
        const user = await this.resolveAndValidateUser(destination, input.type, input.userId);

        const code = this.generateCode();
        const codeHash = await bcrypt.hash(code, 10);
        const expiresAt = new Date(Date.now() + this.getExpireMinutes() * 60 * 1000);

        // 2. Expire all previous active OTPs for this user+destination+type
        await this.otpRepository.expireAll(user.id, destination, input.type);

        // 3. Create new OTP explicitly bound to user.id
        await this.otpRepository.create({
            user_id: user.id,
            destination,
            type: input.type,
            channel: input.channel,
            code_hash: codeHash,
            expires_at: expiresAt,
        });

        // TODO: Integrate notification service to send OTP via email/SMS
        // Example:
        // await this.notificationService.send({
        //     channel: input.channel,
        //     destination,
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
     * Verify an OTP code against the destination + type for the specific user.
     * Increments attempts on each try.
     * On success, marks the user's email or phone as verified by primary key.
     */
    async verify(dto: VerifyOtpDto): Promise<{ message: string }> {
        const destination = this.normalizeDestination(dto.destination, dto.type);

        // 1. Resolve user and check account is active & unverified
        const user = await this.resolveAndValidateUser(destination, dto.type);

        // 2. Find latest valid OTP specifically for THIS user and destination
        const otp = await this.otpRepository.findLatestValid(user.id, destination, dto.type);

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

        // 3. Update user verification flags on user record by user.id
        if (dto.type === OtpType.EMAIL_VERIFICATION) {
            await this.usersRepository.markEmailVerified(user.id);
        } else if (dto.type === OtpType.PHONE_VERIFICATION) {
            await this.usersRepository.markPhoneVerified(user.id);
        }

        return { message: MESSAGES.SUCCESS.OTP_VERIFIED };
    }

    /**
     * Resend a new OTP.
     * Checks:
     *  1. Destination resolves to an active, unverified user
     *  2. An OTP was generated before for THIS exact user and destination
     *  3. The previous OTP was not already verified
     *  4. Cooldown window has passed (e.g. 60 seconds)
     *  5. 24-hour rolling limit for this user (max 3 resends)
     */
    async resend(dto: ResendOtpDto): Promise<{ message: string }> {
        const destination = this.normalizeDestination(dto.destination, dto.type);

        // 1. Check destination resolves to active, unverified user
        const user = await this.resolveAndValidateUser(destination, dto.type);

        // 2. Check if an OTP was generated before for THIS user and destination
        const latestOtp = await this.otpRepository.findLatestAny(user.id, destination, dto.type);
        if (!latestOtp) {
            throw new BadRequestException(MESSAGES.ERROR.NO_PREVIOUS_OTP);
        }

        // 3. Check if previous OTP was already verified
        if (latestOtp.verified_at !== null) {
            throw new BadRequestException(MESSAGES.ERROR.OTP_ALREADY_VERIFIED);
        }

        // 4. Check cooldown between resends
        const cooldownSeconds = this.getResendCooldownSeconds();
        if (cooldownSeconds > 0) {
            const timeSinceLastOtpSeconds =
                (Date.now() - latestOtp.created_at.getTime()) / 1000;
            if (timeSinceLastOtpSeconds < cooldownSeconds) {
                throw new HttpException(
                    MESSAGES.ERROR.RESEND_COOLDOWN,
                    HttpStatus.TOO_MANY_REQUESTS,
                );
            }
        }

        // 5. Check 24-hour rate limit for THIS user
        const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const recentCount = await this.otpRepository.countRecentByDestination(
            user.id,
            destination,
            dto.type,
            since,
        );

        if (recentCount >= this.getMaxResendPer24h()) {
            throw new HttpException(
                MESSAGES.ERROR.RESEND_LIMIT_EXCEEDED,
                HttpStatus.TOO_MANY_REQUESTS,
            );
        }

        // 6. Generate the new OTP bound to user.id
        const code = this.generateCode();
        const codeHash = await bcrypt.hash(code, 10);
        const expiresAt = new Date(Date.now() + this.getExpireMinutes() * 60 * 1000);

        await this.otpRepository.expireAll(user.id, destination, dto.type);

        await this.otpRepository.create({
            user_id: user.id,
            destination,
            type: dto.type,
            channel: dto.channel,
            code_hash: codeHash,
            expires_at: expiresAt,
        });

        return { message: MESSAGES.SUCCESS.OTP_RESENT };
    }
}
