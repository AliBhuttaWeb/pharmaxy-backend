import { Body, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ConsoleController, CurrentUser, Permissions } from '@/common/decorators';
import { AuthenticatedUser } from '@/modules/auth/types';
import { SUPPORT_TICKETS_PERMISSIONS } from '@/common/constants';
import { CreateSupportTicketDto, SupportTicketQueryDto, UpdateSupportTicketStatusDto } from '../dtos';
import { SupportTicketsService } from '../services/support-tickets.service';

@ConsoleController('support-tickets')
export class SupportTicketsConsoleController {
    constructor(private readonly supportTicketsService: SupportTicketsService) {}

    @Get()
    @Permissions(SUPPORT_TICKETS_PERMISSIONS.SUPPORT_TICKET_VIEW_LIST.name)
    findMany(@CurrentUser() user: AuthenticatedUser, @Query() query: SupportTicketQueryDto) {
        return this.supportTicketsService.findMany(user, query);
    }

    @Get(':id')
    @Permissions(SUPPORT_TICKETS_PERMISSIONS.SUPPORT_TICKET_VIEW_DETAIL.name)
    findById(@Param('id', new ParseUUIDPipe()) id: string, @CurrentUser() user: AuthenticatedUser) {
        return this.supportTicketsService.findById(id, user);
    }

    @Post()
    @Permissions(SUPPORT_TICKETS_PERMISSIONS.SUPPORT_TICKET_CREATE.name)
    create(@Body() dto: CreateSupportTicketDto, @CurrentUser() user: AuthenticatedUser) {
        return this.supportTicketsService.create(dto, user);
    }

    @Patch(':id/status')
    @Permissions(SUPPORT_TICKETS_PERMISSIONS.SUPPORT_TICKET_UPDATE.name)
    updateStatus(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Body() dto: UpdateSupportTicketStatusDto,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.supportTicketsService.updateStatus(id, dto, user);
    }
}
