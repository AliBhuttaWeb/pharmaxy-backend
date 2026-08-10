import { Body, Delete, Get, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';

import { ConsoleController, CurrentUser, Permissions } from '@/common/decorators';
import { PermissionsGuard } from '@/common/guards';

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
@UseGuards(PermissionsGuard)
export class PharmaciesConsoleController {
    constructor(private readonly pharmaciesService: PharmaciesService) {}

    @Get()
    @Permissions(PHARMACIES_PERMISSIONS.PHARMACY_VIEW_LIST.name)
    list(@Query() query: FindPharmaciesQueryDto) {
        return this.pharmaciesService.list(query);
    }

    @Get(':id')
    @Permissions(PHARMACIES_PERMISSIONS.PHARMACY_VIEW_DETAIL.name)
    get(@Param('id') id: string) {
        return this.pharmaciesService.get(id);
    }

    @Post()
    @Permissions(PHARMACIES_PERMISSIONS.PHARMACY_CREATE.name)
    create(@Body() dto: CreatePharmacyDto, @CurrentUser() user: AuthenticatedUser) {
        return this.pharmaciesService.create(dto, user);
    }

    @Put(':id')
    @Permissions(PHARMACIES_PERMISSIONS.PHARMACY_UPDATE.name)
    update(@Param('id') id: string, @Body() dto: UpdatePharmacyDto) {
        return this.pharmaciesService.update(id, dto);
    }

    @Patch(':id/status')
    @Permissions(PHARMACIES_PERMISSIONS.PHARMACY_UPDATE_STATUS.name)
    updateStatus(@Param('id') id: string, @Body() dto: UpdatePharmacyStatusDto) {
        return this.pharmaciesService.updateStatus(id, dto);
    }

    @Delete(':id')
    @Permissions(PHARMACIES_PERMISSIONS.PHARMACY_DELETE.name)
    delete(@Param('id') id: string) {
        return this.pharmaciesService.delete(id);
    }
}
