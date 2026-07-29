import { Module } from '@nestjs/common';

import { PrismaModule } from '@/database/prisma/prisma.module';
import { RolesController } from './controllers/roles.controlle';
import { RolesRepository } from './repositories/roles.repository';
import { RolesService } from './services/roles.service';

@Module({
    imports: [PrismaModule],
    controllers: [RolesController],
    providers: [RolesRepository, RolesService],
    exports: [],
})
export class RolesModule {}
