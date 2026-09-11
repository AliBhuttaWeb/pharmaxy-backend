import { Body, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';

import { CreateProductTypeDto, ProductTypeQueryDto, UpdateProductTypeDto } from '../dtos';
import { ProductTypesService } from '../services/product-types.service';
import { ConsoleController, Permissions } from '@/common/decorators';
import { PRODUCT_TYPES_PERMISSIONS } from '@/common/constants';

@ConsoleController('product-types')
export class ProductTypesConsoleController {
    constructor(private readonly productTypeService: ProductTypesService) {}

    @Get()
    @Permissions(PRODUCT_TYPES_PERMISSIONS.PRODUCT_TYPE_VIEW_LIST.name)
    findMany(@Query() query: ProductTypeQueryDto) {
        return this.productTypeService.findMany(query);
    }

    @Get(':id')
    @Permissions(PRODUCT_TYPES_PERMISSIONS.PRODUCT_TYPE_VIEW_DETAIL.name)
    findById(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.productTypeService.findById(id);
    }

    @Post()
    @Permissions(PRODUCT_TYPES_PERMISSIONS.PRODUCT_TYPE_CREATE.name)
    create(@Body() dto: CreateProductTypeDto) {
        return this.productTypeService.create(dto);
    }

    @Patch(':id')
    @Permissions(PRODUCT_TYPES_PERMISSIONS.PRODUCT_TYPE_UPDATE.name)
    update(@Param('id', new ParseUUIDPipe()) id: string, @Body() dto: UpdateProductTypeDto) {
        return this.productTypeService.update(id, dto);
    }

    @Delete(':id')
    @Permissions(PRODUCT_TYPES_PERMISSIONS.PRODUCT_TYPE_DELETE.name)
    delete(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.productTypeService.delete(id);
    }
}
