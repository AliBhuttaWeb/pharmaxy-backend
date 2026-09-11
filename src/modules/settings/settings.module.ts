import { Module } from '@nestjs/common';
import { SettingsConsoleController } from './controllers/settings.console.controller';
import { SettingsService } from './services/settings.service';
import { SettingsRepository } from './repositories/settings.repository';
import { SubscriptionsModule } from '@/modules/subscriptions/subscriptions.module';

@Module({
    imports: [SubscriptionsModule],
    controllers: [SettingsConsoleController],
    providers: [SettingsService, SettingsRepository],
    exports: [SettingsService, SettingsRepository],
})
export class SettingsModule {}
