import {
    BranchProductQueryDto,
    CreateBranchProductDto,
    ProductBatchQueryDto,
    ReceiveStockDto,
    UpdateBranchProductDto,
} from '../dtos';

import { ConsoleController, CurrentUser, Permissions } from '@/common/decorators';
import { Body, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { BranchProductsService } from '../services/branch-products.service';
import { BRANCH_PRODUCTS_PERMISSIONS } from '@/common/constants/permissions/branch-products.permissions';
import { AuthenticatedUser } from '@/modules/auth/types';

@ConsoleController('branch-products')
export class BranchProductsConsoleController {
    constructor(private readonly branchProductsService: BranchProductsService) {}

    @Get()
    @Permissions(BRANCH_PRODUCTS_PERMISSIONS.BRANCH_PRODUCT_VIEW_LIST.name)
    findMany(@Query() query: BranchProductQueryDto, @CurrentUser() user: AuthenticatedUser) {
        return this.branchProductsService.findMany(query, user);
    }

    @Get(':id')
    @Permissions(BRANCH_PRODUCTS_PERMISSIONS.BRANCH_PRODUCT_VIEW_DETAIL.name)
    findById(@Param('id', new ParseUUIDPipe()) id: string, @CurrentUser() user: AuthenticatedUser) {
        return this.branchProductsService.findById(id, user);
    }

    @Post()
    @Permissions(BRANCH_PRODUCTS_PERMISSIONS.BRANCH_PRODUCT_CREATE.name)
    create(@Body() dto: CreateBranchProductDto, @CurrentUser() user: AuthenticatedUser) {
        return this.branchProductsService.create(dto, user);
    }

    @Patch(':id')
    @Permissions(BRANCH_PRODUCTS_PERMISSIONS.BRANCH_PRODUCT_UPDATE.name)
    update(@Param('id', new ParseUUIDPipe()) id: string, @Body() dto: UpdateBranchProductDto, @CurrentUser() user: AuthenticatedUser) {
        return this.branchProductsService.update(id, dto, user);
    }

    @Delete(':id')
    @Permissions(BRANCH_PRODUCTS_PERMISSIONS.BRANCH_PRODUCT_DELETE.name)
    delete(@Param('id', new ParseUUIDPipe()) id: string, @CurrentUser() user: AuthenticatedUser) {
        return this.branchProductsService.delete(id, user);
    }

    @Post(':id/receive-stock')
    @Permissions(BRANCH_PRODUCTS_PERMISSIONS.BRANCH_PRODUCT_UPDATE.name)
    receiveStock(@Param('id', new ParseUUIDPipe()) id: string, @Body() dto: ReceiveStockDto, @CurrentUser() user: AuthenticatedUser) {
        return this.branchProductsService.receiveStock(id, dto, user);
    }

    @Get(':id/batches')
    @Permissions(BRANCH_PRODUCTS_PERMISSIONS.BRANCH_PRODUCT_VIEW_DETAIL.name)
    findBatches(
        @Param('id', new ParseUUIDPipe()) id: string,
        @CurrentUser() user: AuthenticatedUser,
        @Query() query: ProductBatchQueryDto,
    ) {
        return this.branchProductsService.findBatches(id, user, query);
    }
}
