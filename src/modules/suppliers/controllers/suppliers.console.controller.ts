import { Body, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';

import { ConsoleController, Permissions } from '@/common/decorators';

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
    list(@Query() query: FindSuppliersQueryDto) {
        return this.suppliersService.list(query);
    }

    @Get(':id')
    @Permissions(SUPPLIERS_PERMISSIONS.SUPPLIER_VIEW_DETAIL.name)
    get(@Param('id') id: string) {
        return this.suppliersService.get(id);
    }

    @Post()
    @Permissions(SUPPLIERS_PERMISSIONS.SUPPLIER_CREATE.name)
    create(@Body() dto: CreateSupplierDto) {
        return this.suppliersService.create(dto);
    }

    @Put(':id')
    @Permissions(SUPPLIERS_PERMISSIONS.SUPPLIER_UPDATE.name)
    update(@Param('id') id: string, @Body() dto: UpdateSupplierDto) {
        return this.suppliersService.update(id, dto);
    }

    @Patch(':id/status')
    @Permissions(SUPPLIERS_PERMISSIONS.SUPPLIER_UPDATE.name)
    updateStatus(@Param('id') id: string, @Body() dto: UpdateSupplierStatusDto) {
        return this.suppliersService.updateStatus(id, dto);
    }

    @Delete(':id')
    @Permissions(SUPPLIERS_PERMISSIONS.SUPPLIER_DELETE.name)
    delete(@Param('id') id: string) {
        return this.suppliersService.delete(id);
    }
}
