import {
    CanActivate,
    ExecutionContext,
    Injectable,
    ServiceUnavailableException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

import { BYPASS_MAINTENANCE_KEY } from '@/common/decorators/bypass-maintenance.decorator';
import { MESSAGES } from '@/common/constants';

@Injectable()
export class MaintenanceGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly config: ConfigService,
    ) {}

    canActivate(context: ExecutionContext): boolean {
        const isMaintenance = this.config.get<boolean>('maintenance.enabled') ?? false;

        if (!isMaintenance) {
            return true;
        }

        // Allow routes marked with @BypassMaintenance()
        const bypass = this.reflector.getAllAndOverride<boolean>(BYPASS_MAINTENANCE_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (bypass) {
            return true;
        }

        // Allow requests with valid bypass key in header
        const bypassKey = this.config.get<string>('maintenance.bypassKey');
        if (bypassKey) {
            const req = context.switchToHttp().getRequest<Request>();
            const headerKey = req.headers['x-maintenance-bypass'];
            if (headerKey === bypassKey) {
                return true;
            }
        }

        throw new ServiceUnavailableException(MESSAGES.ERROR.MAINTENANCE_MODE);
    }
}
