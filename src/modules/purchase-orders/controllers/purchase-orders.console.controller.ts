import { Body, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';

import { ConsoleController, CurrentUser, Permissions } from '@/common/decorators';

import { PURCHASE_ORDERS_PERMISSIONS } from '@/common/constants';

import {
    CreatePurchaseOrderDto,
    PurchaseOrderQueryDto,
    ReceivePurchaseOrderDto,
    UpdatePurchaseOrderDto,
} from '../dtos';

import { PurchaseOrdersService } from '../services/purchase-orders.service';
import { AuthenticatedUser } from '@/modules/auth/types';

@ConsoleController('purchase-orders')
export class PurchaseOrdersConsoleController {
    constructor(private readonly purchaseOrdersService: PurchaseOrdersService) {}

    @Permissions(PURCHASE_ORDERS_PERMISSIONS.PURCHASE_ORDER_VIEW_LIST.name)
    @Get()
    findMany(@Query() query: PurchaseOrderQueryDto, @CurrentUser() user: AuthenticatedUser) {
        return this.purchaseOrdersService.findMany(query, user);
    }

    @Permissions(PURCHASE_ORDERS_PERMISSIONS.PURCHASE_ORDER_VIEW_DETAIL.name)
    @Get(':id')
    findById(@Param('id', new ParseUUIDPipe()) id: string, @CurrentUser() user: AuthenticatedUser) {
        return this.purchaseOrdersService.findById(id, user);
    }

    @Permissions(PURCHASE_ORDERS_PERMISSIONS.PURCHASE_ORDER_CREATE.name)
    @Post()
    create(@Body() dto: CreatePurchaseOrderDto, @CurrentUser() user: AuthenticatedUser) {
        return this.purchaseOrdersService.create(dto, user);
    }

    @Permissions(PURCHASE_ORDERS_PERMISSIONS.PURCHASE_ORDER_UPDATE.name)
    @Patch(':id')
    update(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Body() dto: UpdatePurchaseOrderDto,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.purchaseOrdersService.update(id, dto, user);
    }

    @Permissions(PURCHASE_ORDERS_PERMISSIONS.PURCHASE_ORDER_APPROVE.name)
    @Patch(':id/approve')
    approve(@Param('id', new ParseUUIDPipe()) id: string, @CurrentUser() user: AuthenticatedUser) {
        return this.purchaseOrdersService.approve(id, user);
    }

    @Permissions(PURCHASE_ORDERS_PERMISSIONS.PURCHASE_ORDER_CANCEL.name)
    @Patch(':id/cancel')
    cancel(@Param('id', new ParseUUIDPipe()) id: string, @CurrentUser() user: AuthenticatedUser) {
        return this.purchaseOrdersService.cancel(id, user);
    }

    @Permissions(PURCHASE_ORDERS_PERMISSIONS.PURCHASE_ORDER_APPROVE.name)
    @Post(':id/receive')
    receive(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Body() dto: ReceivePurchaseOrderDto,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.purchaseOrdersService.receive(id, dto, user);
    }
}

