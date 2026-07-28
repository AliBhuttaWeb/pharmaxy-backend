import { Module } from '@nestjs/common';

import { PrismaModule } from '@/database/prisma/prisma.module';

// import { RolesController } from './controllers/roles.controller';
// import { RolesRepository } from './repositories/roles.repository';
// import { RolesService } from './services/roles.service';

@Module({
    // imports: [PrismaModule],
    // controllers: [RolesController],
    // providers: [RolesRepository, RolesService],
    // exports: [RolesRepository, RolesService],
})
export class RolesModule {}
