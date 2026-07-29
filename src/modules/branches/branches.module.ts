import { Module } from '@nestjs/common';
import { BranchesConsoleController } from './controllers/branches.console.controller';
import { BranchesService } from './services/branches.service';
import { BranchesRepository } from './repositories/branches.repository';

@Module({
    controllers: [
        BranchesConsoleController,
    ],
    providers: [
        BranchesService,
        BranchesRepository,
    ],
    exports: [
    ],
})
export class BranchesModule {}