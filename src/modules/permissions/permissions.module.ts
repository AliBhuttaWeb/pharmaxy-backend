import { Module } from '@nestjs/common';
import { PermissionResolverService } from './services/permissions-resolver.service';

@Module({
    providers: [PermissionResolverService],

    exports: [PermissionResolverService],
})
export class PermissionsModule {}
