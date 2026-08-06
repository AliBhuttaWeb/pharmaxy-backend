import { Body, Delete, Get, Param, Post, Query } from '@nestjs/common';

import { ConsoleController, CurrentUser, Permissions } from '@/common/decorators';

import { AuthenticatedUser } from '@/modules/auth/types';

import { RETURNS_PERMISSIONS } from '@/common/constants';

import { CreateReturnDto, ReturnQueryDto } from '../dtos';

import { ReturnsService } from '../services/returns.service';

@ConsoleController('returns')
export class ReturnsConsoleController {
    constructor(private readonly returnsService: ReturnsService) {}

    @Post()
    @Permissions(RETURNS_PERMISSIONS.RETURN_CREATE.name)
    create(
        @Body() dto: CreateReturnDto,

        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.returnsService.create(dto, user);
    }

    @Get()
    @Permissions(RETURNS_PERMISSIONS.RETURN_VIEW_LIST.name)
    findMany(
        @Query() query: ReturnQueryDto,

        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.returnsService.findMany(user.branch_id!, query);
    }

    @Get(':id')
    @Permissions(RETURNS_PERMISSIONS.RETURN_VIEW_DETAIL.name)
    findById(@Param('id') id: string) {
        return this.returnsService.findById(id);
    }

    @Delete(':id')
    @Permissions(RETURNS_PERMISSIONS.RETURN_CANCEL.name)
    cancel(@Param('id') id: string) {
        return this.returnsService.cancel(id);
    }
}
