import { Module } from '@nestjs/common';

import { PharmacyPaymentMethodsController } from './pharmacy-payment-methods.console.controller';
import { PharmacyPaymentMethodsRepository } from './repositories/pharmacy-payment-methods.repository';
import { PharmacyPaymentMethodsService } from './services/pharmacy-payment-methods.service';

@Module({
    controllers: [PharmacyPaymentMethodsController],
    providers: [PharmacyPaymentMethodsRepository, PharmacyPaymentMethodsService],
    exports: [PharmacyPaymentMethodsService],
})
export class PharmacyPaymentMethodsModule {}
