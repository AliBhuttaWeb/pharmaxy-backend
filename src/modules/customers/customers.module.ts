import { Module } from '@nestjs/common';

import { BranchesModule } from '@/modules/branches/branches.module';

import { CustomersConsoleController } from './controllers/customers.console.controller';

import { CustomersRepository } from './repositories/customers.repository';

import { CustomersService } from './services/customers.service';

@Module({
    imports: [BranchesModule],

    controllers: [CustomersConsoleController],

    providers: [CustomersRepository, CustomersService],

    exports: [CustomersService],
})
export class CustomersModule {}
