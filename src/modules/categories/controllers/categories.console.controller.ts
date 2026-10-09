import { Body, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';

import { CreateCategoryDto, CategoryQueryDto, UpdateCategoryDto } from '../dtos';
import { ConsoleController, Permissions } from '@/common/decorators';
import { CATEGORIES_PERMISSIONS } from '@/common/constants';
import { CategoriesService } from '../services/categories.service';

@ConsoleController('categories')
export class CategoriesConsoleController {
    constructor(private readonly categoriesService: CategoriesService) {}

    @Get()
    @Permissions(CATEGORIES_PERMISSIONS.CATEGORY_VIEW_LIST.name)
    findMany(@Query() query: CategoryQueryDto) {
        return this.categoriesService.findMany(query);
    }

    @Get(':id')
    @Permissions(CATEGORIES_PERMISSIONS.CATEGORY_VIEW_DETAIL.name)
    findById(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.categoriesService.findById(id);
    }

    @Post()
    @Permissions(CATEGORIES_PERMISSIONS.CATEGORY_CREATE.name)
    create(@Body() dto: CreateCategoryDto) {
        return this.categoriesService.create(dto);
    }

    @Patch(':id')
    @Permissions(CATEGORIES_PERMISSIONS.CATEGORY_UPDATE.name)
    update(@Param('id', new ParseUUIDPipe()) id: string, @Body() dto: UpdateCategoryDto) {
        return this.categoriesService.update(id, dto);
    }

    @Delete(':id')
    @Permissions(CATEGORIES_PERMISSIONS.CATEGORY_DELETE.name)
    delete(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.categoriesService.delete(id);
    }
}
