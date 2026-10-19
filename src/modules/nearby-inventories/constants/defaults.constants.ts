export const NEARBY_INVENTORY_DEFAULTS = {
    RESERVATION_EXPIRY_MINUTES: 120,
    RESERVATION_NUMBER_PREFIX: 'RES',
} as const;

export const RESERVATION_DIRECTION = {
    ALL: 'ALL',
    OUTGOING: 'OUTGOING',
    INCOMING: 'INCOMING',
} as const;

export type ReservationDirection =
    (typeof RESERVATION_DIRECTION)[keyof typeof RESERVATION_DIRECTION];
