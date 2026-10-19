import { Body, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Put, Query } from '@nestjs/common';

import { ConsoleController, CurrentUser, Permissions } from '@/common/decorators';

import {
    CreatePharmacyDto,
    FindPharmaciesQueryDto,
    UpdatePharmacyDto,
    UpdatePharmacyStatusDto,
} from '../dtos';
import { PHARMACIES_PERMISSIONS } from '@/common/constants';
import { PharmaciesService } from '../services/pharmacies.services';
import { AuthenticatedUser } from '@/modules/auth/types';

@ConsoleController('pharmacies')
export class PharmaciesConsoleController {
    constructor(private readonly pharmaciesService: PharmaciesService) {}

    @Get()
    @Permissions(PHARMACIES_PERMISSIONS.PHARMACY_VIEW_LIST.name)
    list(@Query() query: FindPharmaciesQueryDto, @CurrentUser() user: AuthenticatedUser) {
        return this.pharmaciesService.list(query, user);
    }

    @Get('deleted')
    @Permissions(PHARMACIES_PERMISSIONS.PHARMACY_VIEW_DELETED.name)
    listDeleted(@Query() query: FindPharmaciesQueryDto, @CurrentUser() user: AuthenticatedUser) {
        return this.pharmaciesService.listDeleted(query, user);
    }

    @Get(':id')
    @Permissions(PHARMACIES_PERMISSIONS.PHARMACY_VIEW_DETAIL.name)
    get(@Param('id', new ParseUUIDPipe()) id: string, @CurrentUser() user: AuthenticatedUser) {
        return this.pharmaciesService.get(id, user);
    }

    @Post()
    @Permissions(PHARMACIES_PERMISSIONS.PHARMACY_CREATE.name)
    create(@Body() dto: CreatePharmacyDto, @CurrentUser() user: AuthenticatedUser) {
        return this.pharmaciesService.create(dto, user);
    }

    @Put(':id')
    @Permissions(PHARMACIES_PERMISSIONS.PHARMACY_UPDATE.name)
    update(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Body() dto: UpdatePharmacyDto,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.pharmaciesService.update(id, dto, user);
    }

    @Patch(':id/status')
    @Permissions(PHARMACIES_PERMISSIONS.PHARMACY_UPDATE_STATUS.name)
    updateStatus(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Body() dto: UpdatePharmacyStatusDto,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.pharmaciesService.updateStatus(id, dto, user);
    }

    @Delete(':id')
    @Permissions(PHARMACIES_PERMISSIONS.PHARMACY_DELETE.name)
    delete(@Param('id', new ParseUUIDPipe()) id: string, @CurrentUser() user: AuthenticatedUser) {
        return this.pharmaciesService.delete(id, user);
    }

    @Patch(':id/restore')
    @Permissions(PHARMACIES_PERMISSIONS.PHARMACY_RESTORE.name)
    restore(@Param('id', new ParseUUIDPipe()) id: string, @CurrentUser() user: AuthenticatedUser) {
        return this.pharmaciesService.restore(id, user);
    }
}

