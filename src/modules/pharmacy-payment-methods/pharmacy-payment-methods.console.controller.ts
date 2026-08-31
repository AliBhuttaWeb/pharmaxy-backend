import { Body, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';

import { Permissions } from '@/common/decorators/permissions.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';

import { AuthenticatedUser } from '@/modules/auth/types/authenticated-user.type';

import {
    CreatePharmacyPaymentMethodDto,
    UpdatePharmacyPaymentMethodDto,
    UpdatePharmacyPaymentMethodStatusDto,
} from './dtos';
import { ConsoleController } from '@/common/decorators';
import { PharmacyPaymentMethodsService } from './services/pharmacy-payment-methods.service';
import { PHARMACY_PAYMENT_METHODS_PERMISSIONS } from '@/common/constants';

@ConsoleController('pharmacies/:pharmacy_id/payment-methods')
export class PharmacyPaymentMethodsController {
    constructor(private readonly pharmacyPaymentMethodsService: PharmacyPaymentMethodsService) {}

    @Get()
    @Permissions(PHARMACY_PAYMENT_METHODS_PERMISSIONS.PHARMACY_PAYMENT_METHOD_VIEW_LIST.name)
    list(
        @Param('pharmacy_id', new ParseUUIDPipe()) pharmacyId: string,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.pharmacyPaymentMethodsService.list(pharmacyId, user);
    }

    @Get(':id')
    @Permissions(PHARMACY_PAYMENT_METHODS_PERMISSIONS.PHARMACY_PAYMENT_METHOD_VIEW_DETAIL.name)
    findById(
        @Param('pharmacy_id', new ParseUUIDPipe()) pharmacyId: string,
        @Param('id', new ParseUUIDPipe()) id: string,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.pharmacyPaymentMethodsService.findById(id, pharmacyId, user);
    }

    @Post()
    @Permissions(PHARMACY_PAYMENT_METHODS_PERMISSIONS.PHARMACY_PAYMENT_METHOD_CREATE.name)
    create(
        @Param('pharmacy_id', new ParseUUIDPipe()) pharmacyId: string,
        @Body() dto: CreatePharmacyPaymentMethodDto,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.pharmacyPaymentMethodsService.create(pharmacyId, dto, user);
    }

    @Patch(':id')
    @Permissions(PHARMACY_PAYMENT_METHODS_PERMISSIONS.PHARMACY_PAYMENT_METHOD_UPDATE.name)
    update(
        @Param('pharmacy_id', new ParseUUIDPipe()) pharmacyId: string,
        @Param('id', new ParseUUIDPipe()) id: string,
        @Body() dto: UpdatePharmacyPaymentMethodDto,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.pharmacyPaymentMethodsService.update(id, pharmacyId, dto, user);
    }

    @Patch(':id/status')
    @Permissions(PHARMACY_PAYMENT_METHODS_PERMISSIONS.PHARMACY_PAYMENT_METHOD_STATUS_UPDATE.name)
    updateStatus(
        @Param('pharmacy_id', new ParseUUIDPipe()) pharmacyId: string,
        @Param('id', new ParseUUIDPipe()) id: string,
        @Body() dto: UpdatePharmacyPaymentMethodStatusDto,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.pharmacyPaymentMethodsService.updateStatus(id, pharmacyId, dto.is_active, user);
    }

    @Delete(':id')
    @Permissions(PHARMACY_PAYMENT_METHODS_PERMISSIONS.PHARMACY_PAYMENT_METHOD_DELETE.name)
    remove(
        @Param('pharmacy_id', new ParseUUIDPipe()) pharmacyId: string,
        @Param('id', new ParseUUIDPipe()) id: string,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.pharmacyPaymentMethodsService.remove(id, pharmacyId, user);
    }
}
