import { Module } from '@nestjs/common';
import { HoldOrdersService } from '@modules/hold-orders/services/hold-orders.service';
import { HoldOrdersRepository } from './repositories/hold-orders.repository';
import { BranchProductsModule } from '../branch-products/branch-products.module';
import { BranchContextService } from '@/common/services/branch-context.service';
import { HoldOrdersConsoleController } from './controllers/hold-orders-console.controller';

@Module({
    imports: [BranchProductsModule],
    controllers: [HoldOrdersConsoleController],
    providers: [
        HoldOrdersService,
        HoldOrdersRepository,
        BranchContextService,
    ],
    exports: [HoldOrdersService],
})
export class HoldOrdersModule {}
