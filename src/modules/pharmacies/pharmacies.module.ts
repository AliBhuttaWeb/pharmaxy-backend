import { Module } from '@nestjs/common';

import { PermissionsGuard } from '@/common/guards';
import { PermissionsModule } from '../permissions/permissions.module';
import { PharmaciesService } from './services/pharmacies.services';
import { PharmaciesRepository } from './repositories/pharmacies.repository';
import { PharmaciesConsoleController } from './controllers/phrmacies.console.controller';

@Module({
    imports: [PermissionsModule],
    controllers: [PharmaciesConsoleController],
    providers: [PharmaciesService, PharmaciesRepository, PermissionsGuard],
    exports: [PharmaciesService, PharmaciesRepository],
})
export class PharmaciesModule {}
