import { Body, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Put, Query } from '@nestjs/common';

import { ConsoleController, CurrentUser, Permissions } from '@/common/decorators';
import type { AuthenticatedUser } from '@/modules/auth/types';

import {
    CreateBranchDto,
    FindBranchesQueryDto,
    UpdateBranchDto,
    UpdateBranchStatusDto,
} from '../dtos';

import { BRANCHES_PERMISSIONS } from '@/common/constants';
import { BranchesService } from '../services/branches.service';

@ConsoleController('branches')
export class BranchesConsoleController {
    constructor(private readonly branchesService: BranchesService) {}

    @Get()
    @Permissions(BRANCHES_PERMISSIONS.BRANCH_VIEW_LIST.name)
    list(@Query() query: FindBranchesQueryDto, @CurrentUser() user: AuthenticatedUser) {
        return this.branchesService.list(query, user);
    }

    @Get(':id')
    @Permissions(BRANCHES_PERMISSIONS.BRANCH_VIEW_DETAIL.name)
    get(@Param('id', new ParseUUIDPipe()) id: string, @CurrentUser() user: AuthenticatedUser) {
        return this.branchesService.get(id, user);
    }

    @Post()
    @Permissions(BRANCHES_PERMISSIONS.BRANCH_CREATE.name)
    create(@Body() dto: CreateBranchDto, @CurrentUser() user: AuthenticatedUser) {
        return this.branchesService.create(dto, user);
    }

    @Put(':id')
    @Permissions(BRANCHES_PERMISSIONS.BRANCH_UPDATE.name)
    update(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Body() dto: UpdateBranchDto,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.branchesService.update(id, dto, user);
    }

    @Patch(':id/status')
    @Permissions(BRANCHES_PERMISSIONS.BRANCH_STATUS_UPDATE.name)
    updateStatus(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Body() dto: UpdateBranchStatusDto,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.branchesService.updateStatus(id, dto, user);
    }

    @Delete(':id')
    @Permissions(BRANCHES_PERMISSIONS.BRANCH_DELETE.name)
    delete(@Param('id', new ParseUUIDPipe()) id: string, @CurrentUser() user: AuthenticatedUser) {
        return this.branchesService.delete(id, user);
    }
}

