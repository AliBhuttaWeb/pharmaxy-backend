import { Body, Get, Param, Patch, Post, Query } from '@nestjs/common';

import {
    AssignSubscriptionDto,
    CancelSubscriptionDto,
    RenewSubscriptionDto,
    SubscriptionQueryDto,
    UpdateSubscriptionDto,
} from '../dtos';

import { SubscriptionsService } from '../services/subscriptions.service';

import { ConsoleController, Permissions } from '@/common/decorators';

import { SUBSCRIPTIONS_PERMISSIONS } from '@/common/constants/permissions';

@ConsoleController('subscriptions')
export class SubscriptionsConsoleController {
    constructor(private readonly subscriptionsService: SubscriptionsService) {}

    @Get()
    @Permissions(SUBSCRIPTIONS_PERMISSIONS.SUBSCRIPTION_VIEW_LIST.name)
    findMany(@Query() query: SubscriptionQueryDto) {
        return this.subscriptionsService.findMany(query);
    }

    @Get(':id')
    @Permissions(SUBSCRIPTIONS_PERMISSIONS.SUBSCRIPTION_VIEW_DETAIL.name)
    findById(@Param('id') id: string) {
        return this.subscriptionsService.findById(id);
    }

    @Post('assign')
    @Permissions(SUBSCRIPTIONS_PERMISSIONS.SUBSCRIPTION_ASSIGN.name)
    assign(@Body() dto: AssignSubscriptionDto) {
        return this.subscriptionsService.assign(dto);
    }

    @Patch(':id')
    @Permissions(SUBSCRIPTIONS_PERMISSIONS.SUBSCRIPTION_UPDATE.name)
    update(@Param('id') id: string, @Body() dto: UpdateSubscriptionDto) {
        return this.subscriptionsService.update(id, dto);
    }

    @Patch(':id/cancel')
    @Permissions(SUBSCRIPTIONS_PERMISSIONS.SUBSCRIPTION_CANCEL.name)
    cancel(@Param('id') id: string, @Body() dto: CancelSubscriptionDto) {
        return this.subscriptionsService.cancel(id, dto);
    }

    @Patch(':id/renew')
    @Permissions(SUBSCRIPTIONS_PERMISSIONS.SUBSCRIPTION_RENEW.name)
    renew(@Param('id') id: string, @Body() dto: RenewSubscriptionDto) {
        return this.subscriptionsService.renew(id, dto);
    }
}
