import {
    BranchProductQueryDto,
    CreateBranchProductDto,
    OnboardBranchProductDto,
    ReceiveStockDto,
    UpdateBranchProductDto,
} from '../dtos';

import { ConsoleController, Permissions } from '@/common/decorators';
import { Body, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { BranchProductsService } from '../services/branch-products.service';
import { BRANCH_PRODUCTS_PERMISSIONS } from '@/common/constants/permissions/branch-products.permissions';

@ConsoleController('branch-products')
export class BranchProductsConsoleController {
    constructor(private readonly branchProductsService: BranchProductsService) {}

    @Get()
    @Permissions(BRANCH_PRODUCTS_PERMISSIONS.BRANCH_PRODUCT_VIEW_LIST.name)
    findMany(@Query() query: BranchProductQueryDto) {
        return this.branchProductsService.findMany(query);
    }

    @Get(':id')
    @Permissions(BRANCH_PRODUCTS_PERMISSIONS.BRANCH_PRODUCT_VIEW_DETAIL.name)
    findById(@Param('id') id: string) {
        return this.branchProductsService.findById(id);
    }

    @Post()
    @Permissions(BRANCH_PRODUCTS_PERMISSIONS.BRANCH_PRODUCT_CREATE.name)
    create(@Body() dto: CreateBranchProductDto) {
        return this.branchProductsService.create(dto);
    }

    @Post('onboard')
    @Permissions(BRANCH_PRODUCTS_PERMISSIONS.BRANCH_PRODUCT_CREATE.name)
    onboard(@Body() dto: OnboardBranchProductDto) {
        return this.branchProductsService.onboard(dto);
    }

    @Patch(':id')
    @Permissions(BRANCH_PRODUCTS_PERMISSIONS.BRANCH_PRODUCT_UPDATE.name)
    update(@Param('id') id: string, @Body() dto: UpdateBranchProductDto) {
        return this.branchProductsService.update(id, dto);
    }

    @Delete(':id')
    @Permissions(BRANCH_PRODUCTS_PERMISSIONS.BRANCH_PRODUCT_DELETE.name)
    delete(@Param('id') id: string) {
        return this.branchProductsService.delete(id);
    }

    @Post(':id/receive-stock')
    @Permissions(BRANCH_PRODUCTS_PERMISSIONS.BRANCH_PRODUCT_UPDATE.name)
    receiveStock(@Param('id') id: string, @Body() dto: ReceiveStockDto) {
        return this.branchProductsService.receiveStock(id, dto);
    }
}
