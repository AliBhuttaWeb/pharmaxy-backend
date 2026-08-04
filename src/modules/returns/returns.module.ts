import { Module } from '@nestjs/common';

import { ReturnsConsoleController } from './controllers/returns.console.controller';

import { ReturnsService } from './services/returns.service';

import { ReturnsRepository } from './repositories/returns.repository';
import { BranchContextService } from '@/common/services/branch-context.service';

@Module({
    controllers: [ReturnsConsoleController],

    providers: [ReturnsService, ReturnsRepository, BranchContextService],

    exports: [ReturnsService],
})
export class ReturnsModule {}
