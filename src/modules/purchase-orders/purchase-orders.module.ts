import { Module } from '@nestjs/common';

import { BranchesModule } from '@/modules/branches/branches.module';
import { ProductsModule } from '@/modules/products/products.module';
import { SuppliersModule } from '@/modules/suppliers/suppliers.module';

import { PurchaseOrdersService } from './services/purchase-orders.service';
import { PurchaseOrdersRepository } from './repositories/purchase-orders-repository';
import { PurchaseOrdersConsoleController } from './controllers/purchase-orders.console.controller';

@Module({
    imports: [BranchesModule, ProductsModule, SuppliersModule],

    controllers: [PurchaseOrdersConsoleController],

    providers: [PurchaseOrdersService, PurchaseOrdersRepository],

    exports: [],
})
export class PurchaseOrdersModule {}
