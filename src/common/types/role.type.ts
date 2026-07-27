import { ROLES } from '../constants';

export type Role = (typeof ROLES)[keyof typeof ROLES]['name'];
