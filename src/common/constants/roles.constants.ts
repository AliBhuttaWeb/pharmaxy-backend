import { ROLE_SCOPES } from './role-scopes';
import { SIGNUP_SCOPES } from './signup-scopes';
import { RoleDefinition } from '../types';

export const ROLES: Record<string, RoleDefinition> = {
    SUPER_ADMIN: {
        name: 'Super Admin',
        description: 'Platform administrator',

        roleScope: ROLE_SCOPES.SYSTEM,
        signupScopes: [],
    },

    PHARMACY_ADMIN: {
        name: 'Pharmacy Admin',
        description: 'Administrator managing pharmacy operations',

        roleScope: ROLE_SCOPES.PHARMACY,
        signupScopes: [SIGNUP_SCOPES.CONSOLE],
    },

    CASHIER: {
        name: 'Cashier',
        description: 'Handles sales and customer transactions',

        roleScope: ROLE_SCOPES.PHARMACY,
        signupScopes: [],
    },

    SUPPLIER: {
        name: 'Supplier',
        description: 'Supplier portal user',

        roleScope: ROLE_SCOPES.SUPPLIER,
        signupScopes: [SIGNUP_SCOPES.SUPPLIER],
    },

    USER: {
        name: 'User',
        description: 'Default authenticated user',

        roleScope: ROLE_SCOPES.USER,
        signupScopes: [SIGNUP_SCOPES.STORE],
    },
} as const;
