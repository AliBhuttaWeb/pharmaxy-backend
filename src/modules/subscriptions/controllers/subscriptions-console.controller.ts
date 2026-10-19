import { Body, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';

import {
    AssignSubscriptionDto,
    CancelSubscriptionDto,
    RenewSubscriptionDto,
    SubscriptionQueryDto,
    UpdateSubscriptionDto,
} from '../dtos';

import { SubscriptionsService } from '../services/subscriptions.service';

import { ConsoleController, CurrentUser, Permissions } from '@/common/decorators';

import { SUBSCRIPTIONS_PERMISSIONS } from '@/common/constants/permissions';
import { AuthenticatedUser } from '@/modules/auth/types';

@ConsoleController('subscriptions')
export class SubscriptionsConsoleController {
    constructor(private readonly subscriptionsService: SubscriptionsService) {}

    @Get('current')
    @Permissions(SUBSCRIPTIONS_PERMISSIONS.SUBSCRIPTION_VIEW_DETAIL.name)
    getCurrent(@CurrentUser() user: AuthenticatedUser) {
        return this.subscriptionsService.getCurrent(user);
    }

    @Get()
    @Permissions(SUBSCRIPTIONS_PERMISSIONS.SUBSCRIPTION_VIEW_LIST.name)
    findMany(@Query() query: SubscriptionQueryDto, @CurrentUser() user: AuthenticatedUser) {
        return this.subscriptionsService.findMany(query, user);
    }

    @Get(':id')
    @Permissions(SUBSCRIPTIONS_PERMISSIONS.SUBSCRIPTION_VIEW_DETAIL.name)
    findById(
        @Param('id', new ParseUUIDPipe()) id: string,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.subscriptionsService.findById(id, user);
    }

    @Post('assign')
    @Permissions(SUBSCRIPTIONS_PERMISSIONS.SUBSCRIPTION_ASSIGN.name)
    assign(@Body() dto: AssignSubscriptionDto, @CurrentUser() user: AuthenticatedUser) {
        return this.subscriptionsService.assign(dto, user);
    }

    @Patch(':id')
    @Permissions(SUBSCRIPTIONS_PERMISSIONS.SUBSCRIPTION_UPDATE.name)
    update(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Body() dto: UpdateSubscriptionDto,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.subscriptionsService.update(id, dto, user);
    }

    @Patch(':id/cancel')
    @Permissions(SUBSCRIPTIONS_PERMISSIONS.SUBSCRIPTION_CANCEL.name)
    cancel(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Body() dto: CancelSubscriptionDto,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.subscriptionsService.cancel(id, dto, user);
    }

    @Patch(':id/renew')
    @Permissions(SUBSCRIPTIONS_PERMISSIONS.SUBSCRIPTION_RENEW.name)
    renew(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Body() dto: RenewSubscriptionDto,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.subscriptionsService.renew(id, dto, user);
    }
}
