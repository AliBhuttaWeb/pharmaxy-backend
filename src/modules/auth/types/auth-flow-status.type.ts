import { AUTH_FLOW_STATUS } from '../constants';

export type AuthFlowStatus = (typeof AUTH_FLOW_STATUS)[keyof typeof AUTH_FLOW_STATUS];
