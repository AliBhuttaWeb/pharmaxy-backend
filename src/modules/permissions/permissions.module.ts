import { Module } from '@nestjs/common';

import { PrismaModule } from '@/database/prisma/prisma.module';

import { PermissionsConsoleController } from './controllers/permissions.console.controller';
import { PermissionsService } from './services/permissions.service';
import { PermissionsRepository } from './repositories/permissions.repository';
import { PermissionResolverService } from './services/permissions-resolver.service';
import { UserPermissionsService } from './services/user-permissions.service';
import { UserPermissionsRepository } from './repositories/user-permissions.repository';

@Module({
    imports: [PrismaModule],
    controllers: [PermissionsConsoleController],
    providers: [PermissionsService, PermissionsRepository, PermissionResolverService, UserPermissionsService, UserPermissionsRepository],
    exports: [PermissionsService, PermissionResolverService],
})
export class PermissionsModule {}
