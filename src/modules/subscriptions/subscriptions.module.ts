import { Module } from '@nestjs/common';

import { SubscriptionsConsoleController } from './controllers/subscriptions-console.controller';

import { SubscriptionsRepository } from './repositories/subscriptions.repository';

import { SubscriptionsService } from './services/subscriptions.service';

import { SubscriptionPlansModule } from '@/modules/subscription-plans/subscription-plans.module';
import { BranchesRepository } from '../branches/repositories/branches.repository';

@Module({
    imports: [SubscriptionPlansModule],

    controllers: [SubscriptionsConsoleController],

    providers: [SubscriptionsRepository, SubscriptionsService, BranchesRepository],

    exports: [SubscriptionsService],
})
export class SubscriptionsModule {}
