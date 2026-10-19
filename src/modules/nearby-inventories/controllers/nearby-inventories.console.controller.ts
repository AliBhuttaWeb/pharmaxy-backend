import { Body, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

import { ConsoleController, CurrentUser, Permissions } from '@/common/decorators';
import { NEARBY_INVENTORIES_PERMISSIONS } from '@/common/constants';
import type { AuthenticatedUser } from '@/modules/auth/types';

import {
    CreateNearbyReservationDto,
    NearbyInventoriesQueryDto,
    NearbyReservationsQueryDto,
    UpdateNearbyReservationStatusDto,
} from '../dtos';
import { NearbyInventoriesService } from '../services/nearby-inventories.service';

@ConsoleController('nearby-inventories')
export class NearbyInventoriesConsoleController {
    constructor(private readonly nearbyInventoriesService: NearbyInventoriesService) {}

    @Get()
    @Permissions(NEARBY_INVENTORIES_PERMISSIONS.NEARBY_INVENTORIES_SEARCH.name)
    @ApiOperation({ summary: 'Search nearby branches for available product inventory' })
    search(@Query() query: NearbyInventoriesQueryDto, @CurrentUser() user: AuthenticatedUser) {
        return this.nearbyInventoriesService.search(query, user);
    }

    @Get('reservations')
    @Permissions(NEARBY_INVENTORIES_PERMISSIONS.NEARBY_INVENTORIES_VIEW_RESERVATIONS.name)
    @ApiOperation({
        summary:
            'List reserved items for both source (OUTGOING) and target (INCOMING) branches with expiry details',
    })
    listReservations(
        @Query() query: NearbyReservationsQueryDto,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.nearbyInventoriesService.listReservations(query, user);
    }

    @Get('reservations/:id')
    @Permissions(NEARBY_INVENTORIES_PERMISSIONS.NEARBY_INVENTORIES_VIEW_RESERVATIONS.name)
    @ApiOperation({ summary: 'Get reservation details by ID' })
    getReservation(
        @Param('id', new ParseUUIDPipe()) id: string,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.nearbyInventoriesService.getReservation(id, user);
    }

    @Post('reserve')
    @Permissions(NEARBY_INVENTORIES_PERMISSIONS.NEARBY_INVENTORIES_RESERVE_ITEM.name)
    @ApiOperation({ summary: 'Reserve an in-stock item from a nearby branch' })
    reserve(@Body() dto: CreateNearbyReservationDto, @CurrentUser() user: AuthenticatedUser) {
        return this.nearbyInventoriesService.reserve(dto, user);
    }

    @Patch('reservations/:id/status')
    @Permissions(NEARBY_INVENTORIES_PERMISSIONS.NEARBY_INVENTORIES_UPDATE_RESERVATION_STATUS.name)
    @ApiOperation({
        summary: 'Update reservation status (CONFIRMED, COMPLETED, CANCELLED)',
    })
    updateReservationStatus(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Body() dto: UpdateNearbyReservationStatusDto,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.nearbyInventoriesService.updateReservationStatus(id, dto, user);
    }

    @Get('stores/:id')
    @Permissions(NEARBY_INVENTORIES_PERMISSIONS.NEARBY_INVENTORIES_VIEW_STORE.name)
    @ApiOperation({ summary: 'Get nearby branch details and its available inventory' })
    getStore(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Query() query: NearbyInventoriesQueryDto,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.nearbyInventoriesService.getStore(id, query, user);
    }
}
