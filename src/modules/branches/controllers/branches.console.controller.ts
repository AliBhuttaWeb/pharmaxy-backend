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
    list(@Query() query: FindBranchesQueryDto) {
        return this.branchesService.list(query);
    }

    @Get(':id')
    @Permissions(BRANCHES_PERMISSIONS.BRANCH_VIEW_DETAIL.name)
    get(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.branchesService.get(id);
    }

    @Post()
    @Permissions(BRANCHES_PERMISSIONS.BRANCH_CREATE.name)
    create(@Body() dto: CreateBranchDto, @CurrentUser() user: AuthenticatedUser) {
        return this.branchesService.create(dto, user);
    }

    @Put(':id')
    @Permissions(BRANCHES_PERMISSIONS.BRANCH_UPDATE.name)
    update(@Param('id', new ParseUUIDPipe()) id: string, @Body() dto: UpdateBranchDto) {
        return this.branchesService.update(id, dto);
    }

    @Patch(':id/status')
    @Permissions(BRANCHES_PERMISSIONS.BRANCH_UPDATE.name)
    updateStatus(@Param('id', new ParseUUIDPipe()) id: string, @Body() dto: UpdateBranchStatusDto) {
        return this.branchesService.updateStatus(id, dto);
    }

    @Delete(':id')
    @Permissions(BRANCHES_PERMISSIONS.BRANCH_DELETE.name)
    delete(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.branchesService.delete(id);
    }
}
