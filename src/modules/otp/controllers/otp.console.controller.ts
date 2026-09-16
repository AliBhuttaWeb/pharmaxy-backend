import { Body, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';

import { ConsoleController, Public } from '@/common/decorators';
import { OtpService } from '../services/otp.service';
import { GenerateOtpDto, ResendOtpDto, VerifyOtpDto } from '../dtos';

/**
 * OTP controller — all routes are public since users call these before authentication.
 *
 * Throttle limits per route (per IP):
 *  - generate: 3 req / min
 *  - verify:   10 req / min
 *  - resend:   3 req / min
 */
@ConsoleController('otp')
export class OtpConsoleController {
    constructor(private readonly otpService: OtpService) {}

    @Post('generate')
    @Public()
    @Throttle({ default: { limit: 3, ttl: 60000 } })
    generate(@Body() dto: GenerateOtpDto) {
        return this.otpService.generateFromDto(dto);
    }

    @Post('verify')
    @Public()
    @Throttle({ default: { limit: 10, ttl: 60000 } })
    verify(@Body() dto: VerifyOtpDto) {
        return this.otpService.verify(dto);
    }

    @Post('resend')
    @Public()
    @Throttle({ default: { limit: 3, ttl: 60000 } })
    resend(@Body() dto: ResendOtpDto) {
        return this.otpService.resend(dto);
    }
}
