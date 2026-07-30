import { Body, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';

import { ConsoleController, Permissions } from '@/common/decorators';

import { CreateManufacturerDto, FindManufacturersQueryDto, UpdateManufacturerDto } from '../dtos';
import { ManufacturersService } from '../services/manufacturer.service';
import { MANUFACTURERS_PERMISSIONS } from '@/common/constants';

@ConsoleController('manufacturers')
export class ManufacturersConsoleController {
    constructor(private readonly manufacturersService: ManufacturersService) {}

    @Get()
    @Permissions(MANUFACTURERS_PERMISSIONS.MANUFACTURER_VIEW_LIST.name)
    list(@Query() query: FindManufacturersQueryDto) {
        return this.manufacturersService.list(query);
    }

    @Get(':id')
    @Permissions(MANUFACTURERS_PERMISSIONS.MANUFACTURER_VIEW_DETAIL.name)
    get(@Param('id') id: string) {
        return this.manufacturersService.get(id);
    }

    @Post()
    @Permissions(MANUFACTURERS_PERMISSIONS.MANUFACTURER_CREATE.name)
    create(@Body() dto: CreateManufacturerDto) {
        return this.manufacturersService.create(dto);
    }

    @Put(':id')
    @Permissions(MANUFACTURERS_PERMISSIONS.MANUFACTURER_UPDATE.name)
    update(@Param('id') id: string, @Body() dto: UpdateManufacturerDto) {
        return this.manufacturersService.update(id, dto);
    }

    @Delete(':id')
    @Permissions(MANUFACTURERS_PERMISSIONS.MANUFACTURER_DELETE.name)
    delete(@Param('id') id: string) {
        return this.manufacturersService.delete(id);
    }
}
