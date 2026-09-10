import { Body, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';

import { CreateRetailCategoryDto, RetailCategoryQueryDto, UpdateRetailCategoryDto } from '../dtos';
import { ConsoleController } from '@/common/decorators';
import { RetailCategoriesService } from '../services/retail-categories.service';

@ConsoleController('retail-categories')
export class RetailCategoriesConsoleController {
    constructor(private readonly retailCategoryService: RetailCategoriesService) {}

    @Get()
    findMany(@Query() query: RetailCategoryQueryDto) {
        return this.retailCategoryService.findMany(query);
    }

    @Get(':id')
    findById(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.retailCategoryService.findById(id);
    }

    @Post()
    create(@Body() dto: CreateRetailCategoryDto) {
        return this.retailCategoryService.create(dto);
    }

    @Patch(':id')
    update(@Param('id', new ParseUUIDPipe()) id: string, @Body() dto: UpdateRetailCategoryDto) {
        return this.retailCategoryService.update(id, dto);
    }

    @Delete(':id')
    delete(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.retailCategoryService.delete(id);
    }
}
