import { Module } from '@nestjs/common';

import { PrismaModule } from '@/database/prisma/prisma.module';
import { PermissionsModule } from '../permissions/permissions.module';
import { RolesConsoleController } from './controllers/roles.console.controlle';
import { RolesRepository } from './repositories/roles.repository';
import { RolesService } from './services/roles.service';

@Module({
    imports: [PrismaModule, PermissionsModule],
    controllers: [RolesConsoleController],
    providers: [RolesRepository, RolesService],
    exports: [],
})
export class RolesModule {}
