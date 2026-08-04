import { ROLES } from '@/common/constants';

import * as permissions from '@/common/constants/permissions';

import {
    getSpecificPermissions,
} from '@/modules/permissions/helpers/permissions.helper';

export const DEFAULT_ROLE_PERMISSIONS = {
    // =====================================================
    // SUPER ADMIN
    // =====================================================

    [ROLES.SUPER_ADMIN.name]: getSpecificPermissions(
        // Dashboard
        ...Object.values(permissions.DASHBOARD_PERMISSIONS),

        // Platform management
        ...Object.values(permissions.PHARMACIES_PERMISSIONS),
        ...Object.values(permissions.BRANCHES_PERMISSIONS),
        ...Object.values(permissions.USERS_PERMISSIONS),

        // Subscription
        ...Object.values(permissions.SUBSCRIPTION_PLANS_PERMISSIONS),

        permissions.SUBSCRIPTIONS_PERMISSIONS.SUBSCRIPTION_VIEW_LIST,
        permissions.SUBSCRIPTIONS_PERMISSIONS.SUBSCRIPTION_VIEW_DETAIL,

        permissions.SUBSCRIPTION_PAYMENTS_PERMISSIONS.SUBSCRIPTION_PAYMENT_VIEW_LIST,

        permissions.SUBSCRIPTION_PAYMENTS_PERMISSIONS.SUBSCRIPTION_PAYMENT_VIEW_DETAIL,

        // Product catalog
        ...Object.values(permissions.PRODUCTS_PERMISSIONS),

        permissions.PRODUCT_BATCHES_PERMISSIONS.PRODUCT_BATCH_VIEW_LIST,
        permissions.PRODUCT_BATCHES_PERMISSIONS.PRODUCT_BATCH_VIEW_DETAIL,

        ...Object.values(permissions.RETAIL_CATEGORIES_PERMISSIONS),
        ...Object.values(permissions.PRODUCT_TYPES_PERMISSIONS  ),
        ...Object.values(permissions.DOSAGE_FORMS_PERMISSIONS),
        ...Object.values(permissions.MANUFACTURERS_PERMISSIONS),

        // Support
        permissions.SUPPORT_TICKETS_PERMISSIONS.SUPPORT_TICKET_VIEW_LIST,
        permissions.SUPPORT_TICKETS_PERMISSIONS.SUPPORT_TICKET_VIEW_DETAIL,
        permissions.SUPPORT_TICKETS_PERMISSIONS.SUPPORT_TICKET_ASSIGN,
        permissions.SUPPORT_TICKETS_PERMISSIONS.SUPPORT_TICKET_CLOSE,

        ...Object.values(permissions.SUPPORT_TICKET_MESSAGES_PERMISSIONS),

        permissions.SUPPORT_TICKET_ATTACHMENTS_PERMISSIONS.SUPPORT_TICKET_ATTACHMENT_VIEW,

        // Logs
        ...Object.values(permissions.SYSTEM_LOGS_PERMISSIONS),

        // Notifications
        ...Object.values(permissions.NOTIFICATIONS_PERMISSIONS),
    ),

    // =====================================================
    // PHARMACY ADMIN
    // =====================================================

    [ROLES.PHARMACY_ADMIN.name]: getSpecificPermissions(
        ...Object.values(permissions.DASHBOARD_PERMISSIONS),

        // Branch
        ...Object.values(permissions.BRANCHES_PERMISSIONS),

        // Inventory
        ...Object.values(permissions.BRANCH_PRODUCTS_PERMISSIONS),

        ...Object.values(permissions.PRODUCT_BATCHES_PERMISSIONS),

        ...Object.values(permissions.STOCK_ADJUSTMENTS_PERMISSIONS),

        // Customers
        ...Object.values(permissions.CUSTOMERS_PERMISSIONS),

        // Suppliers
        ...Object.values(permissions.SUPPLIERS_PERMISSIONS),

        // Purchase orders
        ...Object.values(permissions.PURCHASE_ORDERS_PERMISSIONS),

        // POS
        ...Object.values(permissions.POS_PERMISSIONS),

        // Sales
        ...Object.values(permissions.SALES_PERMISSIONS),

        // Returns
        ...Object.values(permissions.RETURNS_PERMISSIONS),

        // Nearby inventory
        ...Object.values(permissions.NEARBY_INVENTORIES_PERMISSIONS),

        // Reports
        ...Object.values(permissions.REPORTS_PERMISSIONS),

        // Settings
        ...Object.values(permissions.SETTINGS_PERMISSIONS),

        // Support
        permissions.SUPPORT_TICKETS_PERMISSIONS.SUPPORT_TICKET_VIEW_LIST,
        permissions.SUPPORT_TICKETS_PERMISSIONS.SUPPORT_TICKET_VIEW_DETAIL,
        permissions.SUPPORT_TICKETS_PERMISSIONS.SUPPORT_TICKET_CREATE,
        permissions.SUPPORT_TICKETS_PERMISSIONS.SUPPORT_TICKET_UPDATE,

        ...Object.values(permissions.SUPPORT_TICKET_MESSAGES_PERMISSIONS),

        ...Object.values(permissions.SUPPORT_TICKET_ATTACHMENTS_PERMISSIONS),

        ...Object.values(permissions.NOTIFICATIONS_PERMISSIONS),
    ),

    // =====================================================
    // CASHIER
    // =====================================================

    [ROLES.CASHIER.name]: getSpecificPermissions(
        ...Object.values(permissions.DASHBOARD_PERMISSIONS),

        // POS
        ...Object.values(permissions.POS_PERMISSIONS),

        // Sales
        permissions.SALES_PERMISSIONS.SALE_VIEW_LIST,
        permissions.SALES_PERMISSIONS.SALE_VIEW_DETAIL,

        // Customers
        ...Object.values(permissions.CUSTOMERS_PERMISSIONS),

        // Returns
        ...Object.values(permissions.RETURNS_PERMISSIONS),

        // Inventory view
        permissions.BRANCH_PRODUCTS_PERMISSIONS.BRANCH_PRODUCT_VIEW_LIST,

        permissions.BRANCH_PRODUCTS_PERMISSIONS.BRANCH_PRODUCT_VIEW_DETAIL,

        // Stock adjustment
        permissions.STOCK_ADJUSTMENTS_PERMISSIONS.STOCK_ADJUSTMENT_CREATE,

        permissions.STOCK_ADJUSTMENTS_PERMISSIONS.STOCK_ADJUSTMENT_VIEW_LIST,

        permissions.STOCK_ADJUSTMENTS_PERMISSIONS.STOCK_ADJUSTMENT_VIEW_DETAIL,

        ...Object.values(permissions.NEARBY_INVENTORIES_PERMISSIONS),

        ...Object.values(permissions.NOTIFICATIONS_PERMISSIONS),
    ),

    // =====================================================
    // SUPPLIER
    // =====================================================

    [ROLES.SUPPLIER.name]: getSpecificPermissions(
        ...Object.values(permissions.DASHBOARD_PERMISSIONS),

        ...Object.values(permissions.PURCHASE_ORDER_WORKFLOW_PERMISSIONS),

        ...Object.values(permissions.REPORTS_PERMISSIONS),

        ...Object.values(permissions.SETTINGS_PERMISSIONS),

        ...Object.values(permissions.NOTIFICATIONS_PERMISSIONS),
    ),

    // =====================================================
    // USER
    // =====================================================

    [ROLES.USER.name]: getSpecificPermissions(
        ...Object.values(permissions.NOTIFICATIONS_PERMISSIONS),
    ),
} as const;
