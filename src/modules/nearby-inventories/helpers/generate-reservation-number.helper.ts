import { NEARBY_INVENTORY_DEFAULTS } from '../constants';

export function generateReservationNumber(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${NEARBY_INVENTORY_DEFAULTS.RESERVATION_NUMBER_PREFIX}-${timestamp}-${random}`;
}
