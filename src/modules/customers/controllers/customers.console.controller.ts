import { Body, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';

import { ConsoleController, CurrentUser, Permissions } from '@/common/decorators';

import { CUSTOMERS_PERMISSIONS } from '@/common/constants';

import { CreateCustomerDto, CustomerQueryDto, UpdateCustomerDto } from '../dtos';

import { CustomersService } from '../services/customers.service';

import { AuthenticatedUser } from '@/modules/auth/types';
import { getActiveBranchId } from '@/common/helpers';

@ConsoleController('customers')
export class CustomersConsoleController {
    constructor(private readonly customersService: CustomersService) {}

    @Get()
    @Permissions(CUSTOMERS_PERMISSIONS.CUSTOMER_VIEW_LIST.name)
    findMany(@Query() query: CustomerQueryDto, @CurrentUser() user: AuthenticatedUser) {
        return this.customersService.findMany(getActiveBranchId(user), query);
    }

    @Get(':id')
    @Permissions(CUSTOMERS_PERMISSIONS.CUSTOMER_VIEW_DETAIL.name)
    findById(@Param('id') id: string) {
        return this.customersService.findById(id);
    }

    @Post()
    @Permissions(CUSTOMERS_PERMISSIONS.CUSTOMER_CREATE.name)
    create(@Body() dto: CreateCustomerDto, @CurrentUser() user: AuthenticatedUser) {
        return this.customersService.create(getActiveBranchId(user), dto, user);
    }

    @Patch(':id')
    @Permissions(CUSTOMERS_PERMISSIONS.CUSTOMER_UPDATE.name)
    update(
        @Param('id') id: string,
        @Body() dto: UpdateCustomerDto,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.customersService.update(id, dto, user);
    }

    @Delete(':id')
    @Permissions(CUSTOMERS_PERMISSIONS.CUSTOMER_DELETE.name)
    delete(@Param('id') id: string) {
        return this.customersService.delete(id);
    }
}
