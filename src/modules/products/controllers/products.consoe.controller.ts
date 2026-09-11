import { Body, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';

import { CreateProductDto, ProductQueryDto, UpdateProductDto } from '../dtos';
import { ProductsService } from '../services/products.service';
import { ConsoleController, Permissions } from '@/common/decorators';
import { PRODUCTS_PERMISSIONS } from '@/common/constants';

@ConsoleController('products')
export class ProductsConsoleController {
    constructor(private readonly productsService: ProductsService) {}

    @Get()
    @Permissions(PRODUCTS_PERMISSIONS.PRODUCT_VIEW_LIST.name)
    findMany(@Query() query: ProductQueryDto) {
        return this.productsService.findMany(query);
    }

    @Get(':id')
    @Permissions(PRODUCTS_PERMISSIONS.PRODUCT_VIEW_DETAIL.name)
    findById(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.productsService.findById(id);
    }

    @Post()
    @Permissions(PRODUCTS_PERMISSIONS.PRODUCT_CREATE.name)
    create(@Body() dto: CreateProductDto) {
        return this.productsService.create(dto);
    }

    @Patch(':id')
    @Permissions(PRODUCTS_PERMISSIONS.PRODUCT_UPDATE.name)
    update(@Param('id', new ParseUUIDPipe()) id: string, @Body() dto: UpdateProductDto) {
        return this.productsService.update(id, dto);
    }

    @Delete(':id')
    @Permissions(PRODUCTS_PERMISSIONS.PRODUCT_DELETE.name)
    delete(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.productsService.delete(id);
    }
}
