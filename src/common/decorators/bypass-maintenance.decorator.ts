import { SetMetadata } from '@nestjs/common';

export const BYPASS_MAINTENANCE_KEY = 'bypassMaintenance';

/**
 * Decorator to bypass maintenance mode on specific endpoints or controllers.
 */
export const BypassMaintenance = () => SetMetadata(BYPASS_MAINTENANCE_KEY, true);
