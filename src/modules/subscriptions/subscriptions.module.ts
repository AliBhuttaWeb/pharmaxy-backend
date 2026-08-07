import { Module } from '@nestjs/common';

import { SubscriptionsConsoleController } from './controllers/subscriptions-console.controller';

import { SubscriptionsRepository } from './repositories/subscriptions.repository';

import { SubscriptionsService } from './services/subscriptions.service';
import { SubscriptionConstraintService } from './services/subscription-constraint.service';

import { SubscriptionPlansModule } from '@/modules/subscription-plans/subscription-plans.module';

@Module({
    imports: [SubscriptionPlansModule],

    controllers: [SubscriptionsConsoleController],

    providers: [SubscriptionsRepository, SubscriptionsService, SubscriptionConstraintService],

    exports: [SubscriptionsService, SubscriptionConstraintService],
})
export class SubscriptionsModule {}
