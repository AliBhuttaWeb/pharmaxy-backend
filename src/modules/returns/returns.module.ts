import { Module } from '@nestjs/common';

import { ReturnsConsoleController } from './controllers/returns.console.controller';

import { ReturnsService } from './services/returns.service';

import { ReturnsRepository } from './repositories/returns.repository';

@Module({
    controllers: [ReturnsConsoleController],

    providers: [ReturnsService, ReturnsRepository],

    exports: [ReturnsService],
})
export class ReturnsModule {}
