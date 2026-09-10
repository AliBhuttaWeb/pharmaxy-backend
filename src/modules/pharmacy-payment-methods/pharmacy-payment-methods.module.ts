import { Module } from '@nestjs/common';

import { PharmacyPaymentMethodsController } from './pharmacy-payment-methods.console.controller';
import { PharmacyPaymentMethodsRepository } from './repositories/pharmacy-payment-methods.repository';
import { PharmacyPaymentMethodsService } from './services/pharmacy-payment-methods.service';
import { PaymentMethodsModule } from '../payment-methods/payment-methods.module';

@Module({
    imports: [PaymentMethodsModule],
    controllers: [PharmacyPaymentMethodsController],
    providers: [PharmacyPaymentMethodsRepository, PharmacyPaymentMethodsService],
    exports: [PharmacyPaymentMethodsService],
})
export class PharmacyPaymentMethodsModule {}
