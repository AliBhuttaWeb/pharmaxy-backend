import {
    Body,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
} from '@nestjs/common';

import {
    ConsoleController,
    Permissions,
} from '@/common/decorators';

import {
    CreateCategoryDto,
    FindCategoriesQueryDto,
    UpdateCategoryDto,
} from '../dtos';
import { CategoriesService } from '../services/categories.service';
import { CATEGORIES_PERMISSIONS } from '@/common/constants';

@ConsoleController('categories')
export class CategoriesConsoleController {
    constructor(
        private readonly categoriesService: CategoriesService,
    ) {}

    @Get()
    @Permissions(
        CATEGORIES_PERMISSIONS.CATEGORY_VIEW_LIST.name,
    )
    list(
        @Query() query: FindCategoriesQueryDto,
    ) {
        return this.categoriesService.list(query);
    }

    @Get(':id')
    @Permissions(
        CATEGORIES_PERMISSIONS.CATEGORY_VIEW_DETAIL.name,
    )
    get(
        @Param('id') id: string,
    ) {
        return this.categoriesService.get(id);
    }

    @Post()
    @Permissions(
        CATEGORIES_PERMISSIONS.CATEGORY_CREATE.name,
    )
    create(
        @Body() dto: CreateCategoryDto,
    ) {
        return this.categoriesService.create(dto);
    }

    @Put(':id')
    @Permissions(
        CATEGORIES_PERMISSIONS.CATEGORY_UPDATE.name,
    )
    update(
        @Param('id') id: string,
        @Body() dto: UpdateCategoryDto,
    ) {
        return this.categoriesService.update(
            id,
            dto,
        );
    }

    @Delete(':id')
    @Permissions(
        CATEGORIES_PERMISSIONS.CATEGORY_DELETE.name,
    )
    delete(
        @Param('id') id: string,
    ) {
        return this.categoriesService.delete(id);
    }
}