import { Module } from '@nestjs/common';
import { HoldOrdersService } from '@modules/hold-orders/services/hold-orders.service';
import { HoldOrdersRepository } from './repositories/hold-orders.repository';
import { BranchProductsRepository } from '../branch-products/repositories/branch-products.repository';
import { BranchContextService } from '@/common/services/branch-context.service';
import { HoldOrdersConsoleController } from './controllers/hold-orders-console.controller';

@Module({
    controllers: [HoldOrdersConsoleController],
    providers: [HoldOrdersService, HoldOrdersRepository, BranchProductsRepository, BranchContextService],
    exports: [HoldOrdersService],
})
export class HoldOrdersModule {}
