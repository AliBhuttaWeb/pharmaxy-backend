import { PERMISSIONS } from '../constants/permissions.constants';

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
