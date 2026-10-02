import { Get, Query } from '@nestjs/common';
import { ConsoleController, CurrentUser, Permissions } from '@/common/decorators';
import { AuthenticatedUser } from '@/modules/auth/types';
import { SYSTEM_LOGS_PERMISSIONS } from '@/common/constants';
import { SystemLogQueryDto } from '../dtos';
import { SystemLogsService } from '../services/system-logs.service';

@ConsoleController('system-logs')
export class SystemLogsConsoleController {
    constructor(private readonly systemLogsService: SystemLogsService) {}

    @Get()
    @Permissions(SYSTEM_LOGS_PERMISSIONS.SYSTEM_LOG_VIEW_LIST.name)
    findMany(@CurrentUser() user: AuthenticatedUser, @Query() query: SystemLogQueryDto) {
        return this.systemLogsService.findMany(user, query);
    }
}
