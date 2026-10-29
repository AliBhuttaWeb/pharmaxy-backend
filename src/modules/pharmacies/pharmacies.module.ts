import { Module } from '@nestjs/common';

import { PermissionsGuard } from '@/common/guards';
import { PermissionsModule } from '../permissions/permissions.module';
import { PharmacyPaymentMethodsModule } from '../pharmacy-payment-methods/pharmacy-payment-methods.module';
import { PharmaciesService } from './services/pharmacies.services';
import { PharmaciesRepository } from './repositories/pharmacies.repository';
import { PharmaciesConsoleController } from './controllers/phrmacies.console.controller';
import { UsersRepository } from '@modules/users/repositories/users.repository';

@Module({
    imports: [PermissionsModule, PharmacyPaymentMethodsModule],
    controllers: [PharmaciesConsoleController],
    providers: [PharmaciesService, PharmaciesRepository, PermissionsGuard, UsersRepository],
    exports: [PharmaciesService, PharmaciesRepository],
})
export class PharmaciesModule {}
