import { Get, Param, Query, UseGuards } from '@nestjs/common';

import { ConsoleController, Permissions } from '@/common/decorators';
import { PERMISSIONS_PERMISSIONS } from '@/common/constants';
import { PermissionsGuard } from '@/common/guards';

import { PermissionsService } from '../services/permissions.service';
import { FindPermissionsQueryDto } from '../dtos';

@ConsoleController('permissions')
@UseGuards(PermissionsGuard)
export class PermissionsController {
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
}
