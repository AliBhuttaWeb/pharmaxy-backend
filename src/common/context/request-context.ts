import { AsyncLocalStorage } from 'node:async_hooks';
import { AuthenticatedUser } from '@/modules/auth/types';
import { isSuperAdmin as checkIsSuperAdmin } from '../helpers/auth.helper';

export interface RequestStore {
    user: AuthenticatedUser | null;
    pharmacyId: string | null;
    activeBranchId: string | null;
    requestId?: string;
}

export class RequestContext {
    private static readonly storage = new AsyncLocalStorage<RequestStore>();

    /**
     * Runs a function within the specified request context store.
     */
    static run<R>(store: RequestStore, callback: () => R): R {
        return this.storage.run(store, callback);
    }

    /**
     * Returns the current request store, or null if outside request context.
     */
    static getStore(): RequestStore | undefined {
        return this.storage.getStore();
    }

    /**
     * Returns the current authenticated user, or null if unauthenticated.
     */
    static currentUser(): AuthenticatedUser | null {
        return this.getStore()?.user ?? null;
    }

    /**
     * Returns the current pharmacy ID from context.
     */
    static currentPharmacyId(): string | null {
        const store = this.getStore();
        if (!store) return null;
        return store.pharmacyId ?? store.user?.pharmacyId ?? null;
    }

    /**
     * Returns the active branch ID from context.
     */
    static currentActiveBranchId(): string | null {
        const store = this.getStore();
        if (!store) return null;
        return store.activeBranchId ?? store.user?.activeBranchId ?? null;
    }
}
