import { Body, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';

import { ConsoleController, Permissions } from '@/common/decorators';
import { USERS_PERMISSIONS } from '@/common/constants';
import { PermissionsGuard } from '@/common/guards';

import { CreateUserDto, FindUsersQueryDto, UpdateUserDto } from '../dtos';
import { UsersService } from '../services/users.service';

@ConsoleController('users')
@UseGuards(PermissionsGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    @Permissions(USERS_PERMISSIONS.USER_VIEW_LIST.name)
    list(@Query() query: FindUsersQueryDto) {
        return this.usersService.list(query);
    }

    @Post()
    @Permissions(USERS_PERMISSIONS.USER_CREATE.name)
    create(@Body() dto: CreateUserDto) {
        return this.usersService.create(dto);
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
