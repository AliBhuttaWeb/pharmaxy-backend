import { ROLES } from '@/common/constants';

export type Role = (typeof ROLES)[keyof typeof ROLES];
