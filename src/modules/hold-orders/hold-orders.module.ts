import { Module } from '@nestjs/common';
import { HoldOrdersService } from '@modules/hold-orders/services/hold-orders.service';
import { HoldOrdersRepository } from './repositories/hold-orders.repository';
import { BranchProductsModule } from '../branch-products/branch-products.module';
import { HoldOrdersConsoleController } from './controllers/hold-orders-console.controller';

@Module({
    imports: [BranchProductsModule],
    controllers: [HoldOrdersConsoleController],
    providers: [
        HoldOrdersService,
        HoldOrdersRepository,
    ],
    exports: [HoldOrdersService],
})
export class HoldOrdersModule {}
