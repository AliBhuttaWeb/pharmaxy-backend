import { ROLE_SCOPES } from '../constants';

export type RoleScope = (typeof ROLE_SCOPES)[keyof typeof ROLE_SCOPES];
