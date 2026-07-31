import { Body, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';

import { CreateProductDto, ProductQueryDto, UpdateProductDto } from '../dtos';
import { ProductsService } from '../services/products.service';
import { ConsoleController } from '@/common/decorators';

@ConsoleController('products')
export class ProductsConsoleController {
    constructor(private readonly productsService: ProductsService) {}

    @Get()
    findMany(@Query() query: ProductQueryDto) {
        return this.productsService.findMany(query);
    }

    @Get(':id')
    findById(@Param('id') id: string) {
        return this.productsService.findById(id);
    }

    @Post()
    create(@Body() dto: CreateProductDto) {
        return this.productsService.create(dto);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
        return this.productsService.update(id, dto);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.productsService.delete(id);
    }
}
