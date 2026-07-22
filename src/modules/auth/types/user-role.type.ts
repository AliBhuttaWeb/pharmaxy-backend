import type { UserWithPermissions } from './user-with-permissions.type';

export type UserRole = UserWithPermissions['user_roles'][number];
