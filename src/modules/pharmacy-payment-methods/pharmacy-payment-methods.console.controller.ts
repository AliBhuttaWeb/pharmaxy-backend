import { Body, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';

import { Permissions } from '@/common/decorators/permissions.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';

import { AuthenticatedUser } from '@/modules/auth/types/authenticated-user.type';

import {
    CreatePharmacyPaymentMethodDto,
    PharmacyPaymentMethodQueryDto,
    UpdatePharmacyPaymentMethodDto,
    UpdatePharmacyPaymentMethodStatusDto,
} from './dtos';
import { ConsoleController } from '@/common/decorators';
import { PharmacyPaymentMethodsService } from './services/pharmacy-payment-methods.service';
import { PHARMACY_PAYMENT_METHODS_PERMISSIONS } from '@/common/constants';

@ConsoleController('pharmacy-payment-methods')
export class PharmacyPaymentMethodsController {
    constructor(private readonly pharmacyPaymentMethodsService: PharmacyPaymentMethodsService) {}

    @Get()
    @Permissions(PHARMACY_PAYMENT_METHODS_PERMISSIONS.PHARMACY_PAYMENT_METHOD_VIEW_LIST.name)
    list(
        @CurrentUser() user: AuthenticatedUser,
        @Query() query: PharmacyPaymentMethodQueryDto,
    ) {
        return this.pharmacyPaymentMethodsService.list(user, query);
    }

    @Get(':id')
    @Permissions(PHARMACY_PAYMENT_METHODS_PERMISSIONS.PHARMACY_PAYMENT_METHOD_VIEW_DETAIL.name)
    findById(
        @Param('id', new ParseUUIDPipe()) id: string,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.pharmacyPaymentMethodsService.findById(id, user);
    }

    @Post()
    @Permissions(PHARMACY_PAYMENT_METHODS_PERMISSIONS.PHARMACY_PAYMENT_METHOD_CREATE.name)
    create(
        @Body() dto: CreatePharmacyPaymentMethodDto,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.pharmacyPaymentMethodsService.create(dto, user);
    }

    @Patch(':id')
    @Permissions(PHARMACY_PAYMENT_METHODS_PERMISSIONS.PHARMACY_PAYMENT_METHOD_UPDATE.name)
    update(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Body() dto: UpdatePharmacyPaymentMethodDto,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.pharmacyPaymentMethodsService.update(id, dto, user);
    }

    @Patch(':id/status')
    @Permissions(PHARMACY_PAYMENT_METHODS_PERMISSIONS.PHARMACY_PAYMENT_METHOD_STATUS_UPDATE.name)
    updateStatus(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Body() dto: UpdatePharmacyPaymentMethodStatusDto,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.pharmacyPaymentMethodsService.updateStatus(id, dto.is_active, user);
    }

    @Delete(':id')
    @Permissions(PHARMACY_PAYMENT_METHODS_PERMISSIONS.PHARMACY_PAYMENT_METHOD_DELETE.name)
    remove(
        @Param('id', new ParseUUIDPipe()) id: string,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.pharmacyPaymentMethodsService.remove(id, user);
    }
}
