import { Body, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ConsoleController, Permissions } from '@/common/decorators';
import { PAYMENT_METHODS_PERMISSIONS } from '@/common/constants/permissions';
import { CreatePaymentMethodDto, PaymentMethodQueryDto, UpdatePaymentMethodDto } from '../dtos';
import { PaymentMethodsService } from '../services/payment-methods.service';

@ConsoleController('payment-methods')
export class PaymentMethodsConsoleController {
    constructor(private readonly paymentMethodsService: PaymentMethodsService) {}

    @Get()
    @Permissions(PAYMENT_METHODS_PERMISSIONS.PAYMENT_METHOD_VIEW_LIST.name)
    findMany(@Query() query: PaymentMethodQueryDto) {
        return this.paymentMethodsService.findMany(query);
    }

    @Get(':id')
    @Permissions(PAYMENT_METHODS_PERMISSIONS.PAYMENT_METHOD_VIEW_DETAIL.name)
    findById(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.paymentMethodsService.findById(id);
    }

    @Post()
    @Permissions(PAYMENT_METHODS_PERMISSIONS.PAYMENT_METHOD_CREATE.name)
    create(@Body() dto: CreatePaymentMethodDto) {
        return this.paymentMethodsService.create(dto);
    }

    @Patch(':id')
    @Permissions(PAYMENT_METHODS_PERMISSIONS.PAYMENT_METHOD_UPDATE.name)
    update(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Body() dto: UpdatePaymentMethodDto,
    ) {
        return this.paymentMethodsService.update(id, dto);
    }

    @Delete(':id')
    @Permissions(PAYMENT_METHODS_PERMISSIONS.PAYMENT_METHOD_DELETE.name)
    delete(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.paymentMethodsService.delete(id);
    }
}
