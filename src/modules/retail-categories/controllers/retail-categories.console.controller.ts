import { Body, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';

import { CreateRetailCategoryDto, RetailCategoryQueryDto, UpdateRetailCategoryDto } from '../dtos';
import { ConsoleController, Permissions } from '@/common/decorators';
import { RETAIL_CATEGORIES_PERMISSIONS } from '@/common/constants';
import { RetailCategoriesService } from '../services/retail-categories.service';

@ConsoleController('retail-categories')
export class RetailCategoriesConsoleController {
    constructor(private readonly retailCategoryService: RetailCategoriesService) {}

    @Get()
    @Permissions(RETAIL_CATEGORIES_PERMISSIONS.RETAIL_CATEGORY_VIEW_LIST.name)
    findMany(@Query() query: RetailCategoryQueryDto) {
        return this.retailCategoryService.findMany(query);
    }

    @Get(':id')
    @Permissions(RETAIL_CATEGORIES_PERMISSIONS.RETAIL_CATEGORY_VIEW_DETAIL.name)
    findById(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.retailCategoryService.findById(id);
    }

    @Post()
    @Permissions(RETAIL_CATEGORIES_PERMISSIONS.RETAIL_CATEGORY_CREATE.name)
    create(@Body() dto: CreateRetailCategoryDto) {
        return this.retailCategoryService.create(dto);
    }

    @Patch(':id')
    @Permissions(RETAIL_CATEGORIES_PERMISSIONS.RETAIL_CATEGORY_UPDATE.name)
    update(@Param('id', new ParseUUIDPipe()) id: string, @Body() dto: UpdateRetailCategoryDto) {
        return this.retailCategoryService.update(id, dto);
    }

    @Delete(':id')
    @Permissions(RETAIL_CATEGORIES_PERMISSIONS.RETAIL_CATEGORY_DELETE.name)
    delete(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.retailCategoryService.delete(id);
    }
}
