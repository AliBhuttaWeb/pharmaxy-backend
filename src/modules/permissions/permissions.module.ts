import { Module } from '@nestjs/common';

import { PrismaModule } from '@/database/prisma/prisma.module';

import { PermissionsConsoleController } from './controllers/permissions.console.controller';
import { PermissionsService } from './services/permissions.service';
import { PermissionsRepository } from './repositories/permissions.repository';

@Module({
    imports: [PrismaModule],
    controllers: [PermissionsConsoleController],
    providers: [PermissionsService, PermissionsRepository],
    exports: [PermissionsService],
})
export class PermissionsModule {}
