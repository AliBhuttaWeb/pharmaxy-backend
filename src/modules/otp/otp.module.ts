import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PrismaModule } from '@database/prisma/prisma.module';
import { OtpConsoleController } from './controllers/otp.console.controller';
import { OtpService } from './services/otp.service';
import { OtpRepository } from './repositories/otp.repository';

@Module({
    imports: [PrismaModule, ConfigModule],
    controllers: [OtpConsoleController],
    providers: [OtpService, OtpRepository],
    exports: [OtpService],
})
export class OtpModule {}
