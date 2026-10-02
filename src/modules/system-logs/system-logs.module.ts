import { Module } from '@nestjs/common';
import { SystemLogsConsoleController } from './controllers/system-logs.console.controller';
import { SystemLogsService } from './services/system-logs.service';
import { SystemLogsRepository } from './repositories/system-logs.repository';

@Module({
    controllers: [SystemLogsConsoleController],
    providers: [SystemLogsService, SystemLogsRepository],
    exports: [SystemLogsService, SystemLogsRepository],
})
export class SystemLogsModule {}
