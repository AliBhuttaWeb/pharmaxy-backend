import { ROLES } from '@/common/constants';

export const ROLE_HIERARCHY = {
    [ROLES.SUPER_ADMIN.name]: [ROLES.PHARMACY_ADMIN.name, ROLES.SUPPLIER.name, ROLES.USER.name],

    [ROLES.PHARMACY_ADMIN.name]: [ROLES.CASHIER.name],

    [ROLES.SUPPLIER.name]: [ROLES.USER.name],
} as const;
