import { Body, Get, Param, ParseUUIDPipe, Put, Query } from '@nestjs/common';

import { ConsoleController, CurrentUser, Permissions, Public } from '@/common/decorators';
import { ROLES_PERMISSIONS } from '@/common/constants';
import type { AuthenticatedUser } from '@/modules/auth/types';

import { FindRolesQueryDto, UpdateRolePermissionsDto } from '../dtos';

import { RolesService } from '../services/roles.service';

@ConsoleController('roles')
export class RolesConsoleController {
    constructor(private readonly rolesService: RolesService) {}

    @Get('signup')
    @Public()
    listSignup(@Query() query: FindRolesQueryDto) {
        return this.rolesService.listSignup(query);
    }

    @Get()
    @Permissions(ROLES_PERMISSIONS.ROLE_VIEW_LIST.name)
    list(@Query() query: FindRolesQueryDto, @CurrentUser() user: AuthenticatedUser) {
        return this.rolesService.list(query, user);
    }

    @Get(':id')
    @Permissions(ROLES_PERMISSIONS.ROLE_VIEW_DETAIL.name)
    get(@Param('id', new ParseUUIDPipe()) id: string, @CurrentUser() user: AuthenticatedUser) {
        return this.rolesService.get(id, user);
    }

    @Get(':id/permissions')
    @Permissions(ROLES_PERMISSIONS.VIEW_ROLE_PERMISSIONS_LIST.name)
    getPermissions(
        @Param('id', new ParseUUIDPipe()) id: string,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.rolesService.getPermissions(id, user);
    }

    @Put(':id/permissions')
    @Permissions(ROLES_PERMISSIONS.ROLE_ASSIGN_PERMISSION.name)
    assignPermissions(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Body() dto: UpdateRolePermissionsDto,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.rolesService.replacePermissions(id, dto, user);
    }
}
