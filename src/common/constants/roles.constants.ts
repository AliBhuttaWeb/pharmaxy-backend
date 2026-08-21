import { RoleScope, SignupScope } from '@gen/prisma/enums';

export const ROLES = {
    SUPER_ADMIN: {
        name: 'Super Admin',
        description: 'Platform administrator',
        roleScope: RoleScope.GLOBAL,
    },

    PHARMACY_ADMIN: {
        name: 'Pharmacy Admin',
        description: 'Administrator managing pharmacy operations',
        roleScope: RoleScope.PHARMACY,
        signup_scope: SignupScope.CONSOLE,
    },

    CASHIER: {
        name: 'Cashier',
        description: 'Handles sales and customer transactions',
        roleScope: RoleScope.PHARMACY,
    },

    SUPPLIER: {
        name: 'Supplier',
        description: 'Supplier portal user',
        roleScope: RoleScope.GLOBAL,
        signup_scope: SignupScope.CONSOLE,
    },

    USER: {
        name: 'User',
        description: 'Default authenticated user',
        roleScope: RoleScope.GLOBAL,
        signup_scope: SignupScope.STORE,
    },
} as const;
