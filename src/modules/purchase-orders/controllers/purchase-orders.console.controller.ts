import { Body, Get, Param, Patch, Post, Query } from '@nestjs/common';

import { ConsoleController, Permissions } from '@/common/decorators';

import { PURCHASE_ORDERS_PERMISSIONS } from '@/common/constants';

import { CreatePurchaseOrderDto, PurchaseOrderQueryDto, UpdatePurchaseOrderDto } from '../dtos';

import { PurchaseOrdersService } from '../services/purchase-orders.service';

@ConsoleController('purchase-orders')
export class PurchaseOrdersConsoleController {
    constructor(private readonly purchaseOrdersService: PurchaseOrdersService) {}

    @Permissions(PURCHASE_ORDERS_PERMISSIONS.PURCHASE_ORDER_VIEW_LIST.name)
    @Get()
    findMany(@Query() query: PurchaseOrderQueryDto) {
        return this.purchaseOrdersService.findMany(query);
    }

    @Permissions(PURCHASE_ORDERS_PERMISSIONS.PURCHASE_ORDER_VIEW_DETAIL.name)
    @Get(':id')
    findById(@Param('id') id: string) {
        return this.purchaseOrdersService.findById(id);
    }

    @Permissions(PURCHASE_ORDERS_PERMISSIONS.PURCHASE_ORDER_CREATE.name)
    @Post()
    create(@Body() dto: CreatePurchaseOrderDto) {
        return this.purchaseOrdersService.create(dto);
    }

    @Permissions(PURCHASE_ORDERS_PERMISSIONS.PURCHASE_ORDER_UPDATE.name)
    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdatePurchaseOrderDto) {
        return this.purchaseOrdersService.update(id, dto);
    }
}
