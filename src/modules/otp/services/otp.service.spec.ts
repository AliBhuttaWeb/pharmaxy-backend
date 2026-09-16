import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { OtpChannel, OtpType } from '@gen/prisma/enums';

import { OtpService } from './otp.service';
import { MESSAGES } from '../constants';

describe('OtpService', () => {
    let service: OtpService;
    let mockOtpRepo: any;
    let mockConfigService: any;

    beforeEach(() => {
        mockOtpRepo = {
            create: jest.fn().mockResolvedValue({ id: 'otp-1' }),
            findLatestValid: jest.fn(),
            expireAll: jest.fn().mockResolvedValue(undefined),
            countRecentByDestination: jest.fn().mockResolvedValue(0),
            markVerified: jest.fn().mockResolvedValue(undefined),
            incrementAttempts: jest.fn().mockResolvedValue(undefined),
            markEmailVerified: jest.fn().mockResolvedValue(undefined),
            markPhoneVerified: jest.fn().mockResolvedValue(undefined),
        };

        const configMap: Record<string, any> = {
            'otp.length': 6,
            'otp.expireMinutes': 10,
            'otp.maxResendPer24h': 3,
            'otp.maxVerifyAttempts': 5,
        };

        mockConfigService = {
            get: jest.fn((key: string) => configMap[key]),
            getOrThrow: jest.fn((key: string) => {
                const val = configMap[key];
                if (val === undefined) throw new Error(`Config ${key} not found`);
                return val;
            }),
        };

        service = new OtpService(mockOtpRepo, mockConfigService);
    });

    describe('generate', () => {
        it('should expire existing OTPs and create a new hashed OTP record', async () => {
            const input = {
                destination: 'user@example.com',
                type: OtpType.EMAIL_VERIFICATION,
                channel: OtpChannel.EMAIL,
            };

            const result = await service.generate(input);

            expect(mockOtpRepo.expireAll).toHaveBeenCalledWith(input.destination, input.type);
            expect(mockOtpRepo.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    destination: input.destination,
                    type: input.type,
                    channel: input.channel,
                    code_hash: expect.any(String),
                    expires_at: expect.any(Date),
                }),
            );
            expect(result.message).toBe(MESSAGES.SUCCESS.OTP_SENT);
        });
    });

    describe('verify', () => {
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
            expect(mockOtpRepo.markEmailVerified).toHaveBeenCalledWith('user@example.com');
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
            expect(mockOtpRepo.markPhoneVerified).toHaveBeenCalledWith('+923001234567');
            expect(result.message).toBe(MESSAGES.SUCCESS.OTP_VERIFIED);
        });
    });

    describe('resend', () => {
        it('should throw 429 if resend limit of 3 in 24h is reached', async () => {
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

        it('should generate new OTP if count is below 3', async () => {
            mockOtpRepo.countRecentByDestination.mockResolvedValue(2);

            const result = await service.resend({
                destination: 'user@example.com',
                type: OtpType.EMAIL_VERIFICATION,
                channel: OtpChannel.EMAIL,
            });

            expect(mockOtpRepo.expireAll).toHaveBeenCalledWith(
                'user@example.com',
                OtpType.EMAIL_VERIFICATION,
            );
            expect(mockOtpRepo.create).toHaveBeenCalled();
            expect(result.message).toBe(MESSAGES.SUCCESS.OTP_RESENT);
        });
    });
});
