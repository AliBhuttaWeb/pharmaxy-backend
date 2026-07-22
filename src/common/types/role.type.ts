import { ROLES } from '@/common/constants/roles.constants';

export type Role = (typeof ROLES)[keyof typeof ROLES];
