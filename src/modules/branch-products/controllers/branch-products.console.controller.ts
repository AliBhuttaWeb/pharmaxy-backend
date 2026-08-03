import { Body, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';

import { BranchProductQueryDto, CreateBranchProductDto, UpdateBranchProductDto } from '../dtos';
import { BranchProductsService } from '../services/branch-products.service';
import { ConsoleController } from '@/common/decorators';

@ConsoleController('branch-products')
export class BranchProductsConsoleController {
    constructor(private readonly branchProductsService: BranchProductsService) {}

    @Get()
    findMany(@Query() query: BranchProductQueryDto) {
        return this.branchProductsService.findMany(query);
    }

    @Get(':id')
    findById(@Param('id') id: string) {
        return this.branchProductsService.findById(id);
    }

    @Post()
    create(@Body() dto: CreateBranchProductDto) {
        return this.branchProductsService.create(dto);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateBranchProductDto) {
        return this.branchProductsService.update(id, dto);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.branchProductsService.delete(id);
    }
}
