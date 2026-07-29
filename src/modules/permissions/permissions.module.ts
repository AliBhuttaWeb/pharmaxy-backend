import { Module } from '@nestjs/common';

import { PrismaModule } from '@/database/prisma/prisma.module';

import { PermissionsController } from './controllers/permissions.controller';
import { PermissionsService } from './services/permissions.service';
import { PermissionsRepository } from './repositories/permissions.repository';

@Module({
    imports: [PrismaModule],
    controllers: [PermissionsController],
    providers: [PermissionsService, PermissionsRepository],
    exports: [PermissionsService],
})
export class PermissionsModule {}
