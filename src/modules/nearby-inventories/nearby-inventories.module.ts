import { Module } from '@nestjs/common';

import { NearbyInventoriesConsoleController } from './controllers/nearby-inventories.console.controller';
import { NearbyInventoriesRepository } from './repositories/nearby-inventories.repository';
import { NearbyReservationsRepository } from './repositories/nearby-reservations.repository';
import { NearbyInventoriesService } from './services/nearby-inventories.service';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';

@Module({
    imports: [SubscriptionsModule],
    controllers: [NearbyInventoriesConsoleController],
    providers: [
        NearbyInventoriesService,
        NearbyInventoriesRepository,
        NearbyReservationsRepository,
    ],
    exports: [NearbyInventoriesService],
})
export class NearbyInventoriesModule {}
