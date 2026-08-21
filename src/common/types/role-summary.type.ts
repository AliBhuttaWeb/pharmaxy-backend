import { Role } from '@gen/prisma/client';

export type RoleSummary = Pick<Role, 'id' | 'name' | 'role_scope' | 'signup_scope'>;
