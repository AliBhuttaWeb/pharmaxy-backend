import { Body, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';

import { ConsoleController, CurrentUser, Permissions } from '@/common/decorators';
import { USERS_PERMISSIONS } from '@/common/constants';
import type { AuthenticatedUser } from '@/modules/auth/types';

import { CreateUserDto, FindUsersQueryDto, UpdateUserDto } from '../dtos';
import { UsersService } from '../services/users.service';

@ConsoleController('users')
export class UsersConsoleController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    @Permissions(USERS_PERMISSIONS.USER_VIEW_LIST.name)
    list(@Query() query: FindUsersQueryDto) {
        return this.usersService.list(query);
    }

    @Post()
    @Permissions(USERS_PERMISSIONS.USER_CREATE.name)
    create(@Body() dto: CreateUserDto, @CurrentUser() user: AuthenticatedUser) {
        return this.usersService.create(dto, user);
    }

    @Get(':id')
    @Permissions(USERS_PERMISSIONS.USER_VIEW_DETAIL.name)
    get(@Param('id') id: string) {
        return this.usersService.get(id);
    }

    @Put(':id')
    @Permissions(USERS_PERMISSIONS.USER_UPDATE.name)
    update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
        return this.usersService.update(id, dto);
    }

    @Delete(':id')
    @Permissions(USERS_PERMISSIONS.USER_DELETE.name)
    delete(@Param('id') id: string) {
        return this.usersService.delete(id);
    }
}
