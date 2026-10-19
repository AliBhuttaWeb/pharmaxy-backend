import { Body, Delete, Get, Param, ParseUUIDPipe, Post, Put, Query } from '@nestjs/common';

import { ConsoleController, CurrentUser, Permissions } from '@/common/decorators';
import { USERS_PERMISSIONS } from '@/common/constants';
import type { AuthenticatedUser } from '@/modules/auth/types';

import { CreateUserDto, FindUsersQueryDto, QuickCreateUserDto, UpdateUserDto } from '../dtos';
import { UsersService } from '../services/users.service';

@ConsoleController('users')
export class UsersConsoleController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    @Permissions(USERS_PERMISSIONS.USER_VIEW_LIST.name)
    list(@Query() query: FindUsersQueryDto, @CurrentUser() user: AuthenticatedUser) {
        return this.usersService.list(query, user);
    }

    @Post()
    @Permissions(USERS_PERMISSIONS.USER_CREATE.name)
    create(@Body() dto: CreateUserDto, @CurrentUser() user: AuthenticatedUser) {
        return this.usersService.create(dto, user);
    }

    @Post('quick-create')
    @Permissions(USERS_PERMISSIONS.USER_QUICK_CREATE.name)
    quickCreate(@Body() dto: QuickCreateUserDto, @CurrentUser() user: AuthenticatedUser) {
        return this.usersService.quickCreate(dto, user);
    }

    @Get(':id')
    @Permissions(USERS_PERMISSIONS.USER_VIEW_DETAIL.name)
    get(@Param('id', new ParseUUIDPipe()) id: string, @CurrentUser() user: AuthenticatedUser) {
        return this.usersService.get(id, user);
    }

    @Put(':id')
    @Permissions(USERS_PERMISSIONS.USER_UPDATE.name)
    update(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Body() dto: UpdateUserDto,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.usersService.update(id, dto, user);
    }

    @Delete(':id')
    @Permissions(USERS_PERMISSIONS.USER_DELETE.name)
    delete(@Param('id', new ParseUUIDPipe()) id: string, @CurrentUser() user: AuthenticatedUser) {
        return this.usersService.delete(id, user);
    }
}

