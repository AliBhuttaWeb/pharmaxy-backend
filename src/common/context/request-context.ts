import { AsyncLocalStorage } from 'node:async_hooks';

import { AuthenticatedUser } from '@/modules/auth/types';

export type RequestStore = {
    user: AuthenticatedUser | null;
    requestId?: string;
};

export class RequestContext {
    private static readonly storage = new AsyncLocalStorage<RequestStore>();

    static run<T>(store: RequestStore, callback: () => T): T {
        return this.storage.run(store, callback);
    }

    static get(): RequestStore | undefined {
        return this.storage.getStore();
    }
}