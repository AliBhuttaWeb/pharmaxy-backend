import { Get, Param, Query, UseGuards } from '@nestjs/common';

import { ConsoleController, CurrentUser, Permissions } from '@/common/decorators';
import { PERMISSIONS_PERMISSIONS } from '@/common/constants';
import { PermissionsGuard } from '@/common/guards';

import { PermissionsService } from '../services/permissions.service';
import { FindPermissionsQueryDto } from '../dtos';
import { AuthenticatedUser } from '@/modules/auth/types';

@ConsoleController('permissions')
@UseGuards(PermissionsGuard)
export class PermissionsConsoleController {
    constructor(private readonly permissionsService: PermissionsService) {}

    @Get()
    @Permissions(PERMISSIONS_PERMISSIONS.PERMISSION_VIEW_LIST.name)
    list(@Query() query: FindPermissionsQueryDto) {
        return this.permissionsService.list(query);
    }

    @Get(':id')
    @Permissions(PERMISSIONS_PERMISSIONS.PERMISSION_VIEW_DETAIL.name)
    get(@Param('id') id: string) {
        return this.permissionsService.get(id);
    }

    @Get('me')
    getMyPermissions(@CurrentUser() user: AuthenticatedUser) {
        return this.permissionsService.getUserPermissions(user.id);
    }
}
