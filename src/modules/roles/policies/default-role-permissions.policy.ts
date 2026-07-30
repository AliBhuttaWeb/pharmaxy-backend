import { ROLES } from '@/common/constants';
import {
    getAllPermissions,
    getPermissions,
} from '@/modules/permissions/helpers/permissions.helper';

export const DEFAULT_ROLE_PERMISSIONS = {
    [ROLES.SUPER_ADMIN.name]: getPermissions(
        // Platform management
        'DASHBOARD',

        'PHARMACIES',
        'BRANCHES',

        'USERS',

        // Subscription & billing
        'SUBSCRIPTION_PLANS',
        'SUBSCRIPTIONS',
        'SUBSCRIPTION_PAYMENTS',

        // Catalog control (platform level)
        'PRODUCTS',
        'PRODUCT_BATCHES',
        'RETAIL_CATEGORIES',
        'PRODUCT_TYPES',
        'DOSAGE_FORMS',
        'MANUFACTURERS',

        // Support
        'SUPPORT_TICKETS',
        'SUPPORT_TICKET_MESSAGES',
        'SUPPORT_TICKET_ATTACHMENTS',

        // Platform monitoring
        'SYSTEM_LOGS',

        // Communication
        'NOTIFICATIONS',
    ),

    [ROLES.PHARMACY_ADMIN.name]: getPermissions(
        'BRANCHES',

        'PRODUCTS',
        'PRODUCT_BATCHES',
        'STOCK_ADJUSTMENTS',

        'CUSTOMERS',
        'SUPPLIERS',

        'PURCHASE_ORDERS',
        'PURCHASE_ORDER_WORKFLOW',

        'POS',
        'SALES',
        'RETURNS',

        'NEARBY_INVENTORIES',

        'REPORTS',
        'SETTINGS',

        'NOTIFICATIONS',

        'SUPPORT_TICKETS',
        'SUPPORT_TICKET_MESSAGES',
        'SUPPORT_TICKET_ATTACHMENTS',
    ),

    [ROLES.CASHIER.name]: getPermissions(
        'POS',
        'SALES',
        'RETURNS',

        'CUSTOMERS',

        'NEARBY_INVENTORIES',

        'NOTIFICATIONS',
    ),

    [ROLES.SUPPLIER.name]: getPermissions('PURCHASE_ORDER_WORKFLOW', 'NOTIFICATIONS'),

    [ROLES.USER.name]: getPermissions('NOTIFICATIONS'),
} as const;
