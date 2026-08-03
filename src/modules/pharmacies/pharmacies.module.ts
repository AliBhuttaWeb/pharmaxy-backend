import { Module } from '@nestjs/common';

import { PermissionsGuard } from '@/common/guards';
import { PharmaciesService } from './services/pharmacies.services';
import { PharmaciesRepository } from './repositories/pharmacies.repository';
import { PharmaciesConsoleController } from './controllers/phrmacies.console.controller';
import { PermissionResolverService } from '../permissions/services/permissions-resolver.service';

@Module({
    controllers: [PharmaciesConsoleController],
    providers: [
        PharmaciesService,
        PharmaciesRepository,
        PermissionsGuard,
        PermissionResolverService,
    ],
})
export class PharmaciesModule {}
