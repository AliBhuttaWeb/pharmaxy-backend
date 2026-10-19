import { Body, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Put, Query } from '@nestjs/common';

import { ConsoleController, CurrentUser, Permissions } from '@/common/decorators';
import { AuthenticatedUser } from '@/modules/auth/types';

import {
    CreateSupplierDto,
    FindSuppliersQueryDto,
    UpdateSupplierDto,
    UpdateSupplierStatusDto,
} from '../dtos';

import { SUPPLIERS_PERMISSIONS } from '@/common/constants';
import { SuppliersService } from '../services/suppliers.service';

@ConsoleController('suppliers')
export class SuppliersConsoleController {
    constructor(private readonly suppliersService: SuppliersService) {}

    @Get()
    @Permissions(SUPPLIERS_PERMISSIONS.SUPPLIER_VIEW_LIST.name)
    list(@Query() query: FindSuppliersQueryDto, @CurrentUser() user: AuthenticatedUser) {
        return this.suppliersService.list(query, user);
    }

    @Get(':id')
    @Permissions(SUPPLIERS_PERMISSIONS.SUPPLIER_VIEW_DETAIL.name)
    get(@Param('id', new ParseUUIDPipe()) id: string, @CurrentUser() user: AuthenticatedUser) {
        return this.suppliersService.get(id, user);
    }

    @Post()
    @Permissions(SUPPLIERS_PERMISSIONS.SUPPLIER_CREATE.name)
    create(@Body() dto: CreateSupplierDto, @CurrentUser() user: AuthenticatedUser) {
        return this.suppliersService.create(dto, user);
    }

    @Put(':id')
    @Permissions(SUPPLIERS_PERMISSIONS.SUPPLIER_UPDATE.name)
    update(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Body() dto: UpdateSupplierDto,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.suppliersService.update(id, dto, user);
    }

    @Patch(':id/status')
    @Permissions(SUPPLIERS_PERMISSIONS.SUPPLIER_UPDATE.name)
    updateStatus(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Body() dto: UpdateSupplierStatusDto,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.suppliersService.updateStatus(id, dto, user);
    }

    @Delete(':id')
    @Permissions(SUPPLIERS_PERMISSIONS.SUPPLIER_DELETE.name)
    delete(@Param('id', new ParseUUIDPipe()) id: string, @CurrentUser() user: AuthenticatedUser) {
        return this.suppliersService.delete(id, user);
    }
}

