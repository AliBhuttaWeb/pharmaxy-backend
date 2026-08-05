import { Module } from '@nestjs/common';

import { SubscriptionPlansConsoleController } from './controllers/subscription-plans.console.controller';

import { SubscriptionPlansService } from './services/subscription-plans.service';

import { SubscriptionPlansRepository } from './repositories/subscription-plans.repository';

@Module({
    controllers: [SubscriptionPlansConsoleController],

    providers: [SubscriptionPlansService, SubscriptionPlansRepository],

    exports: [SubscriptionPlansService],
})
export class SubscriptionPlansModule {}
