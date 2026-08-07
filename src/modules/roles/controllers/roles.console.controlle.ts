import { Body, Get, Param, Put, Query, UseGuards } from '@nestjs/common';

import { ConsoleController, Permissions, Public } from '@/common/decorators';

import { PermissionsGuard } from '@/common/guards';

import { ROLES_PERMISSIONS } from '@/common/constants';

import { FindRolesQueryDto, UpdateRolePermissionsDto } from '../dtos';

import { RolesService } from '../services/roles.service';

@ConsoleController('roles')
@UseGuards(PermissionsGuard)
export class RolesConsoleController {
    constructor(private readonly rolesService: RolesService) {}

    @Get()
    @Public()
    list(@Query() query: FindRolesQueryDto) {
        return this.rolesService.list(query);
    }

    @Get(':id')
    @Permissions(ROLES_PERMISSIONS.ROLE_VIEW_DETAIL.name)
    get(@Param('id') id: string) {
        return this.rolesService.get(id);
    }

    @Get(':id/permissions')
    @Permissions(ROLES_PERMISSIONS.ROLE_VIEW_DETAIL.name)
    getPermissions(@Param('id') id: string) {
        return this.rolesService.getPermissions(id);
    }

    @Put(':id/permissions')
    @Permissions(ROLES_PERMISSIONS.ROLE_ASSIGN_PERMISSION.name)
    assignPermissions(@Param('id') id: string, @Body() dto: UpdateRolePermissionsDto) {
        return this.rolesService.assignPermissions(id, dto);
    }
}
