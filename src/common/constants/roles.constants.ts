import { RoleScope, SignupScope } from '@gen/prisma/enums';

export const ROLES = {
    SUPER_ADMIN: {
        name: 'Super Admin',
        description: 'Platform administrator',
        role_scope: RoleScope.GLOBAL,
        parent: null,
    },

    PHARMACY_ADMIN: {
        name: 'Pharmacy Admin',
        description: 'Administrator managing pharmacy operations',
        role_scope: RoleScope.PHARMACY,
        signup_scope: SignupScope.CONSOLE,
        parent: 'Super Admin',
    },

    CASHIER: {
        name: 'Cashier',
        description: 'Handles sales and customer transactions',
        role_scope: RoleScope.PHARMACY,
        parent: 'Pharmacy Admin',
    },

    SUPPLIER: {
        name: 'Supplier',
        description: 'Supplier portal user',
        role_scope: RoleScope.GLOBAL,
        signup_scope: SignupScope.CONSOLE,
        parent: 'Super Admin',
    },

    USER: {
        name: 'User',
        description: 'Default authenticated user',
        role_scope: RoleScope.GLOBAL,
        signup_scope: SignupScope.STORE,
        parent: 'Super Admin',
    },
} as const;
