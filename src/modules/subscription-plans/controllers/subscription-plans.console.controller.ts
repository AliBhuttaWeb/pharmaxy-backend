import { Body, Get, Param, Patch, Post, Query } from '@nestjs/common';

import {
    CreateSubscriptionPlanDto,
    SubscriptionPlanQueryDto,
    UpdateSubscriptionPlanDto,
} from '../dtos';

import { SubscriptionPlansService } from '../services/subscription-plans.service';

import { ConsoleController, Permissions } from '@/common/decorators';

import { SUBSCRIPTION_PLANS_PERMISSIONS } from '@/common/constants/permissions';

@ConsoleController('subscription-plans')
export class SubscriptionPlansConsoleController {
    constructor(private readonly subscriptionPlansService: SubscriptionPlansService) {}

    @Get()
    @Permissions(SUBSCRIPTION_PLANS_PERMISSIONS.SUBSCRIPTION_PLAN_VIEW_LIST.name)
    findMany(@Query() query: SubscriptionPlanQueryDto) {
        return this.subscriptionPlansService.findMany(query);
    }

    @Get(':id')
    @Permissions(SUBSCRIPTION_PLANS_PERMISSIONS.SUBSCRIPTION_PLAN_VIEW_DETAIL.name)
    findById(@Param('id') id: string) {
        return this.subscriptionPlansService.findById(id);
    }

    @Post()
    @Permissions(SUBSCRIPTION_PLANS_PERMISSIONS.SUBSCRIPTION_PLAN_CREATE.name)
    create(@Body() dto: CreateSubscriptionPlanDto) {
        return this.subscriptionPlansService.create(dto);
    }

    @Patch(':id')
    @Permissions(SUBSCRIPTION_PLANS_PERMISSIONS.SUBSCRIPTION_PLAN_UPDATE.name)
    update(
        @Param('id') id: string,

        @Body() dto: UpdateSubscriptionPlanDto,
    ) {
        return this.subscriptionPlansService.update(id, dto);
    }

    @Patch(':id/activate')
    @Permissions(SUBSCRIPTION_PLANS_PERMISSIONS.SUBSCRIPTION_PLAN_UPDATE.name)
    activate(@Param('id') id: string) {
        return this.subscriptionPlansService.activate(id);
    }

    @Patch(':id/deactivate')
    @Permissions(SUBSCRIPTION_PLANS_PERMISSIONS.SUBSCRIPTION_PLAN_UPDATE.name)
    deactivate(@Param('id') id: string) {
        return this.subscriptionPlansService.deactivate(id);
    }
}
