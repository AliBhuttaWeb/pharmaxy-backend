import { Body, Post } from '@nestjs/common';

import { ConsoleController, CurrentUser, Permissions } from '@/common/decorators';

import { AuthenticatedUser } from '@/modules/auth/types';
import { POS_PERMISSIONS } from '@/common/constants';

import { CreatePosSaleDto } from '../dtos';
import { PosService } from '../services/pos.service';

@ConsoleController('pos')
export class PosConsoleController {
    constructor(private readonly posService: PosService) {}

    @Post('sale')
    @Permissions(POS_PERMISSIONS.POS_CREATE_SALE.name)
    createSale(
        @Body() dto: CreatePosSaleDto,

        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.posService.createSale(dto, user);
    }

    @Post('quick-sale')
    @Permissions(POS_PERMISSIONS.POS_QUICK_SALE.name)
    quickSale(
        @Body() dto: CreatePosSaleDto,

        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.posService.createQuickSale(dto, user);
    }
}
