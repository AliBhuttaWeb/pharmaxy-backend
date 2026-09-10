import { Module } from '@nestjs/common';
import { PaymentMethodsConsoleController } from './controllers/payment-methods.console.controller';
import { PaymentMethodsRepository } from './repositories/payment-methods.repository';
import { PaymentMethodsService } from './services/payment-methods.service';

@Module({
    controllers: [PaymentMethodsConsoleController],
    providers: [PaymentMethodsRepository, PaymentMethodsService],
    exports: [PaymentMethodsRepository, PaymentMethodsService],
})
export class PaymentMethodsModule {}
