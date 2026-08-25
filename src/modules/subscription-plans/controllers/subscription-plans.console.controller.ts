import { Body, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';

import {
    CreateSubscriptionPlanDto,
    SubscriptionPlanQueryDto,
    UpdateSubscriptionPlanDto,
    UpdateSubscriptionPlanStatusDto,
} from '../dtos';

import { SubscriptionPlansService } from '../services/subscription-plans.service';

import { ConsoleController, Permissions, Public } from '@/common/decorators';

import { SUBSCRIPTION_PLANS_PERMISSIONS } from '@/common/constants/permissions';

@ConsoleController('subscription-plans')
export class SubscriptionPlansConsoleController {
    constructor(private readonly subscriptionPlansService: SubscriptionPlansService) {}

    @Get()
    @Public()
    findMany(@Query() query: SubscriptionPlanQueryDto) {
        return this.subscriptionPlansService.findMany(query);
    }

    @Get(':id')
    @Public()
    findById(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.subscriptionPlansService.findById(id);
    }

    @Post()
    @Permissions(SUBSCRIPTION_PLANS_PERMISSIONS.SUBSCRIPTION_PLAN_CREATE.name)
    create(@Body() dto: CreateSubscriptionPlanDto) {
        return this.subscriptionPlansService.create(dto);
    }

    @Patch(':id')
    @Permissions(SUBSCRIPTION_PLANS_PERMISSIONS.SUBSCRIPTION_PLAN_UPDATE.name)
    update(@Param('id', new ParseUUIDPipe()) id: string, @Body() dto: UpdateSubscriptionPlanDto) {
        return this.subscriptionPlansService.update(id, dto);
    }

    @Patch(':id/status')
    @Permissions(SUBSCRIPTION_PLANS_PERMISSIONS.SUBSCRIPTION_PLAN_STATUS_UPDATE.name)
    updateStatus(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Body() dto: UpdateSubscriptionPlanStatusDto,
    ) {
        return this.subscriptionPlansService.updateStatus(id, dto);
    }
}
