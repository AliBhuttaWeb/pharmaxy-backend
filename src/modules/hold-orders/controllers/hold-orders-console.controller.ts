import { Body, Delete, Get, Param, Post, Query } from '@nestjs/common';

import { ConsoleController, CurrentUser, Permissions } from '@/common/decorators';

import { AuthenticatedUser } from '@/modules/auth/types';

import { HOLD_ORDERS_PERMISSIONS } from '@/common/constants';

import { CreateHoldOrderDto, HoldOrderQueryDto } from '../dtos';

import { HoldOrdersService } from '../services/hold-orders.service';

@ConsoleController('hold-orders')
export class HoldOrdersConsoleController {
    constructor(private readonly holdOrdersService: HoldOrdersService) {}

    @Post()
    @Permissions(HOLD_ORDERS_PERMISSIONS.HOLD_ORDER_CREATE.name)
    create(
        @Body() dto: CreateHoldOrderDto,

        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.holdOrdersService.create(dto, user);
    }

    @Get()
    @Permissions(HOLD_ORDERS_PERMISSIONS.HOLD_ORDER_VIEW_LIST.name)
    findMany(
        @Query() query: HoldOrderQueryDto,

        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.holdOrdersService.findMany(user.activeBranchId!, query);
    }

    @Get(':id')
    @Permissions(HOLD_ORDERS_PERMISSIONS.HOLD_ORDER_VIEW_DETAIL.name)
    findById(@Param('id') id: string) {
        return this.holdOrdersService.findById(id);
    }

    @Delete(':id')
    @Permissions(HOLD_ORDERS_PERMISSIONS.HOLD_ORDER_CANCEL.name)
    cancel(@Param('id') id: string) {
        return this.holdOrdersService.cancel(id);
    }

    @Post(':id/resume')
    @Permissions(HOLD_ORDERS_PERMISSIONS.HOLD_ORDER_RESUME.name)
    resume(@Param('id') id: string) {
        return this.holdOrdersService.resume(id);
    }
}
