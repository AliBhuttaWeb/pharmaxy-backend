import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
} from '@nestjs/common';

import {
    CreateProductTypeDto,
    ProductTypeQueryDto,
    UpdateProductTypeDto,
} from '../dtos';
import { ProductTypesService } from '../services/product-types.service';
import { ConsoleController } from '@/common/decorators';


@ConsoleController('product-types')
export class ProductTypesConsoleController {
    constructor(
        private readonly productTypeService: ProductTypesService,
    ) {}

    @Get()
    findMany(@Query() query: ProductTypeQueryDto) {
        return this.productTypeService.findMany(query);
    }

    @Get(':id')
    findById(@Param('id') id: string) {
        return this.productTypeService.findById(id);
    }

    @Post()
    create(@Body() dto: CreateProductTypeDto) {
        return this.productTypeService.create(dto);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() dto: UpdateProductTypeDto,
    ) {
        return this.productTypeService.update(id, dto);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.productTypeService.delete(id);
    }
}