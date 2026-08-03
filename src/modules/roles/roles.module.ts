import { Module } from '@nestjs/common';

import { PrismaModule } from '@/database/prisma/prisma.module';
import { RolesConsoleController } from './controllers/roles.console.controlle';
import { RolesRepository } from './repositories/roles.repository';
import { RolesService } from './services/roles.service';
import { PermissionResolverService } from '../permissions/services/permissions-resolver.service';

@Module({
    imports: [PrismaModule],
    controllers: [RolesConsoleController],
    providers: [RolesRepository, RolesService, PermissionResolverService],
    exports: [],
})
export class RolesModule {}
