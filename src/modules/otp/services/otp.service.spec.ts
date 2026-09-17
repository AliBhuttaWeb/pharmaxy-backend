import {
    BadRequestException,
    HttpException,
    NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { OtpChannel, OtpType } from '@gen/prisma/enums';

import { OtpService } from './otp.service';
import { MESSAGES } from '../constants';

describe('OtpService', () => {
    let service: OtpService;
    let mockOtpRepo: any;
    let mockUsersRepo: any;
    let mockConfigService: any;

    const mockUnverifiedEmailUser = {
        id: 'user-email-1',
        email: 'user@example.com',
        is_email_verified: false,
        status: 'ACTIVE',
    };

    const mockUnverifiedPhoneUser = {
        id: 'user-phone-1',
        phone: '+923001234567',
        is_phone_verified: false,
        status: 'ACTIVE',
    };

    beforeEach(() => {
        mockOtpRepo = {
            create: jest.fn().mockResolvedValue({ id: 'otp-1' }),
            findLatestValid: jest.fn(),
            findLatestAny: jest.fn().mockResolvedValue({
                id: 'otp-1',
                user_id: 'user-email-1',
                created_at: new Date(Date.now() - 120 * 1000), // 2 minutes ago (past 60s cooldown)
                verified_at: null,
            }),
            expireAll: jest.fn().mockResolvedValue(undefined),
            countRecentByDestination: jest.fn().mockResolvedValue(0),
            markVerified: jest.fn().mockResolvedValue(undefined),
            incrementAttempts: jest.fn().mockResolvedValue(undefined),
        };

        mockUsersRepo = {
            findByEmail: jest.fn().mockResolvedValue(mockUnverifiedEmailUser),
            findByPhone: jest.fn().mockResolvedValue(mockUnverifiedPhoneUser),
            markEmailVerified: jest.fn().mockResolvedValue(undefined),
            markPhoneVerified: jest.fn().mockResolvedValue(undefined),
        };

        const configMap: Record<string, any> = {
            'otp.length': 6,
            'otp.expireMinutes': 10,
            'otp.maxResendPer24h': 3,
            'otp.maxVerifyAttempts': 5,
            'otp.resendCooldownSeconds': 60,
        };

        mockConfigService = {
            get: jest.fn((key: string) => configMap[key]),
            getOrThrow: jest.fn((key: string) => {
                const val = configMap[key];
                if (val === undefined) throw new Error(`Config ${key} not found`);
                return val;
            }),
        };

        service = new OtpService(mockOtpRepo, mockUsersRepo, mockConfigService);
    });

    describe('generate', () => {
        it('should resolve user, expire existing OTPs, and create a new hashed OTP bound to user_id', async () => {
            const input = {
                destination: 'user@example.com',
                type: OtpType.EMAIL_VERIFICATION,
                channel: OtpChannel.EMAIL,
            };

            const result = await service.generate(input);

            expect(mockUsersRepo.findByEmail).toHaveBeenCalledWith('user@example.com');
            expect(mockOtpRepo.expireAll).toHaveBeenCalledWith(
                'user-email-1',
                'user@example.com',
                input.type,
            );
            expect(mockOtpRepo.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    user_id: 'user-email-1',
                    destination: 'user@example.com',
                    type: input.type,
                    channel: input.channel,
                    code_hash: expect.any(String),
                    expires_at: expect.any(Date),
                }),
            );
            expect(result.message).toBe(MESSAGES.SUCCESS.OTP_SENT);
        });

        it('should throw NotFoundException if user is not found', async () => {
            mockUsersRepo.findByEmail.mockResolvedValue(null);

            await expect(
                service.generate({
                    destination: 'unknown@example.com',
                    type: OtpType.EMAIL_VERIFICATION,
                    channel: OtpChannel.EMAIL,
                }),
            ).rejects.toThrow(NotFoundException);
        });

        it('should throw BadRequestException if email is already verified', async () => {
            mockUsersRepo.findByEmail.mockResolvedValue({
                ...mockUnverifiedEmailUser,
                is_email_verified: true,
            });

            await expect(
                service.generate({
                    destination: 'user@example.com',
                    type: OtpType.EMAIL_VERIFICATION,
                    channel: OtpChannel.EMAIL,
                }),
            ).rejects.toThrow(
                new BadRequestException(MESSAGES.ERROR.OTP_ALREADY_VERIFIED),
            );
        });

        it('should throw BadRequestException if phone is already verified', async () => {
            mockUsersRepo.findByPhone.mockResolvedValue({
                ...mockUnverifiedPhoneUser,
                is_phone_verified: true,
            });

            await expect(
                service.generate({
                    destination: '+923001234567',
                    type: OtpType.PHONE_VERIFICATION,
                    channel: OtpChannel.SMS,
                }),
            ).rejects.toThrow(
                new BadRequestException(MESSAGES.ERROR.OTP_ALREADY_VERIFIED),
            );
        });

        it('should throw BadRequestException if user status is INACTIVE or BLOCKED', async () => {
            mockUsersRepo.findByEmail.mockResolvedValue({
                ...mockUnverifiedEmailUser,
                status: 'BLOCKED',
            });

            await expect(
                service.generate({
                    destination: 'user@example.com',
                    type: OtpType.EMAIL_VERIFICATION,
                    channel: OtpChannel.EMAIL,
                }),
            ).rejects.toThrow(
                new BadRequestException(MESSAGES.ERROR.ACCOUNT_INACTIVE),
            );
        });
    });

    describe('verify', () => {
        it('should throw BadRequestException if destination is already verified', async () => {
            mockUsersRepo.findByEmail.mockResolvedValue({
                ...mockUnverifiedEmailUser,
                is_email_verified: true,
            });

            await expect(
                service.verify({
                    destination: 'user@example.com',
                    type: OtpType.EMAIL_VERIFICATION,
                    code: '123456',
                }),
            ).rejects.toThrow(
                new BadRequestException(MESSAGES.ERROR.OTP_ALREADY_VERIFIED),
            );
        });

        it('should throw BadRequestException if OTP is not found or expired', async () => {
            mockOtpRepo.findLatestValid.mockResolvedValue(null);

            await expect(
                service.verify({
                    destination: 'user@example.com',
                    type: OtpType.EMAIL_VERIFICATION,
                    code: '123456',
                }),
            ).rejects.toThrow(BadRequestException);
        });

        it('should throw 429 TOO_MANY_REQUESTS if verify attempts exceeded limit', async () => {
            mockOtpRepo.findLatestValid.mockResolvedValue({
                id: 'otp-1',
                attempts: 5,
                code_hash: 'hashed',
            });

            await expect(
                service.verify({
                    destination: 'user@example.com',
                    type: OtpType.EMAIL_VERIFICATION,
                    code: '123456',
                }),
            ).rejects.toThrow(HttpException);
        });

        it('should increment attempts and throw BadRequestException on code mismatch', async () => {
            const codeHash = await bcrypt.hash('654321', 10);
            mockOtpRepo.findLatestValid.mockResolvedValue({
                id: 'otp-1',
                attempts: 0,
                code_hash: codeHash,
            });

            await expect(
                service.verify({
                    destination: 'user@example.com',
                    type: OtpType.EMAIL_VERIFICATION,
                    code: '123456',
                }),
            ).rejects.toThrow(BadRequestException);

            expect(mockOtpRepo.incrementAttempts).toHaveBeenCalledWith('otp-1');
            expect(mockOtpRepo.markVerified).not.toHaveBeenCalled();
        });

        it('should mark verified and mark user email verified on successful email OTP', async () => {
            const code = '123456';
            const codeHash = await bcrypt.hash(code, 10);
            mockOtpRepo.findLatestValid.mockResolvedValue({
                id: 'otp-1',
                attempts: 1,
                code_hash: codeHash,
            });

            const result = await service.verify({
                destination: 'user@example.com',
                type: OtpType.EMAIL_VERIFICATION,
                code,
            });

            expect(mockOtpRepo.incrementAttempts).toHaveBeenCalledWith('otp-1');
            expect(mockOtpRepo.markVerified).toHaveBeenCalledWith('otp-1');
            expect(mockUsersRepo.markEmailVerified).toHaveBeenCalledWith('user-email-1');
            expect(result.message).toBe(MESSAGES.SUCCESS.OTP_VERIFIED);
        });

        it('should mark verified and mark user phone verified on successful phone OTP', async () => {
            const code = '654321';
            const codeHash = await bcrypt.hash(code, 10);
            mockOtpRepo.findLatestValid.mockResolvedValue({
                id: 'otp-2',
                attempts: 0,
                code_hash: codeHash,
            });

            const result = await service.verify({
                destination: '+923001234567',
                type: OtpType.PHONE_VERIFICATION,
                code,
            });

            expect(mockOtpRepo.incrementAttempts).toHaveBeenCalledWith('otp-2');
            expect(mockOtpRepo.markVerified).toHaveBeenCalledWith('otp-2');
            expect(mockUsersRepo.markPhoneVerified).toHaveBeenCalledWith('user-phone-1');
            expect(result.message).toBe(MESSAGES.SUCCESS.OTP_VERIFIED);
        });
    });

    describe('resend', () => {
        it('should throw BadRequestException if email is already verified', async () => {
            mockUsersRepo.findByEmail.mockResolvedValue({
                ...mockUnverifiedEmailUser,
                is_email_verified: true,
            });

            await expect(
                service.resend({
                    destination: 'user@example.com',
                    type: OtpType.EMAIL_VERIFICATION,
                    channel: OtpChannel.EMAIL,
                }),
            ).rejects.toThrow(
                new BadRequestException(MESSAGES.ERROR.OTP_ALREADY_VERIFIED),
            );
        });

        it('should throw BadRequestException if no previous OTP was ever generated for this user', async () => {
            mockOtpRepo.findLatestAny.mockResolvedValue(null);

            await expect(
                service.resend({
                    destination: 'user@example.com',
                    type: OtpType.EMAIL_VERIFICATION,
                    channel: OtpChannel.EMAIL,
                }),
            ).rejects.toThrow(
                new BadRequestException(MESSAGES.ERROR.NO_PREVIOUS_OTP),
            );
        });

        it('should throw BadRequestException if previous OTP was already verified', async () => {
            mockOtpRepo.findLatestAny.mockResolvedValue({
                id: 'otp-1',
                user_id: 'user-email-1',
                verified_at: new Date(),
                created_at: new Date(Date.now() - 120000),
            });

            await expect(
                service.resend({
                    destination: 'user@example.com',
                    type: OtpType.EMAIL_VERIFICATION,
                    channel: OtpChannel.EMAIL,
                }),
            ).rejects.toThrow(
                new BadRequestException(MESSAGES.ERROR.OTP_ALREADY_VERIFIED),
            );
        });

        it('should throw 429 if attempting to resend before cooldown passes', async () => {
            mockOtpRepo.findLatestAny.mockResolvedValue({
                id: 'otp-1',
                user_id: 'user-email-1',
                verified_at: null,
                created_at: new Date(Date.now() - 20 * 1000), // only 20 seconds ago (< 60s cooldown)
            });

            await expect(
                service.resend({
                    destination: 'user@example.com',
                    type: OtpType.EMAIL_VERIFICATION,
                    channel: OtpChannel.EMAIL,
                }),
            ).rejects.toThrow(HttpException);
        });

        it('should throw 429 if resend limit of 3 in 24h is reached for this user', async () => {
            mockOtpRepo.countRecentByDestination.mockResolvedValue(3);

            await expect(
                service.resend({
                    destination: 'user@example.com',
                    type: OtpType.EMAIL_VERIFICATION,
                    channel: OtpChannel.EMAIL,
                }),
            ).rejects.toThrow(HttpException);

            expect(mockOtpRepo.expireAll).not.toHaveBeenCalled();
        });

        it('should generate new OTP bound to user_id if count is below 3 and cooldown passed', async () => {
            mockOtpRepo.countRecentByDestination.mockResolvedValue(2);

            const result = await service.resend({
                destination: 'user@example.com',
                type: OtpType.EMAIL_VERIFICATION,
                channel: OtpChannel.EMAIL,
            });

            expect(mockOtpRepo.expireAll).toHaveBeenCalledWith(
                'user-email-1',
                'user@example.com',
                OtpType.EMAIL_VERIFICATION,
            );
            expect(mockOtpRepo.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    user_id: 'user-email-1',
                    destination: 'user@example.com',
                    type: OtpType.EMAIL_VERIFICATION,
                    channel: OtpChannel.EMAIL,
                }),
            );
            expect(result.message).toBe(MESSAGES.SUCCESS.OTP_RESENT);
        });
    });
});
