import { Body, Get, Patch } from '@nestjs/common';
import { ConsoleController, CurrentUser, Permissions } from '@/common/decorators';
import { AuthenticatedUser } from '@/modules/auth/types';
import { SETTINGS_PERMISSIONS } from '@/common/constants';
import { SettingsService } from '../services/settings.service';
import { UpdateSettingsDto } from '../dtos';

@ConsoleController('settings')
export class SettingsConsoleController {
    constructor(private readonly settingsService: SettingsService) {}

    @Get()
    @Permissions(SETTINGS_PERMISSIONS.SETTINGS_VIEW.name)
    get(@CurrentUser() user: AuthenticatedUser) {
        return this.settingsService.getSettings(user);
    }

    @Patch()
    @Permissions(SETTINGS_PERMISSIONS.SETTINGS_UPDATE.name)
    update(
        @CurrentUser() user: AuthenticatedUser,
        @Body() dto: UpdateSettingsDto,
    ) {
        return this.settingsService.updateSettings(user, dto);
    }
}
