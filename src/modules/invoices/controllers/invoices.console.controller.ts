import { Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ConsoleController, CurrentUser, Permissions } from '@/common/decorators';
import { AuthenticatedUser } from '@/modules/auth/types';
import { SALES_PERMISSIONS } from '@/common/constants';
import { FindInvoicesQueryDto } from '../dtos';
import { InvoicesService } from '../services/invoices.service';

@ConsoleController('invoices')
export class InvoicesConsoleController {
    constructor(private readonly invoicesService: InvoicesService) {}

    @Get()
    @Permissions(SALES_PERMISSIONS.SALE_VIEW_LIST.name)
    list(
        @Query() query: FindInvoicesQueryDto,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.invoicesService.list(query, user);
    }

    @Get(':id')
    @Permissions(SALES_PERMISSIONS.SALE_VIEW_DETAIL.name)
    get(
        @Param('id', new ParseUUIDPipe()) id: string,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.invoicesService.get(id, user);
    }
}
