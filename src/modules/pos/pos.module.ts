import { Module } from '@nestjs/common';
import { BranchProductsModule } from '../branch-products/branch-products.module';
import { CustomersModule } from '../customers/customers.module';
import { ProductsModule } from '../products/products.module';
import { PosConsoleController } from './controllers/pos.console.controller';
import { PosRepository } from './repositories/pos.repository';
import { PosService } from './services/pos.service';
import { HoldOrdersModule } from '../hold-orders/hold-orders.module';
import { InvoicesModule } from '../invoices/invoices.module';

@Module({
    imports: [
        ProductsModule,
        BranchProductsModule,
        CustomersModule,
        HoldOrdersModule,
        InvoicesModule,
    ],

    controllers: [PosConsoleController],

    providers: [PosRepository, PosService],
    exports: [],
})
export class PosModule {}
