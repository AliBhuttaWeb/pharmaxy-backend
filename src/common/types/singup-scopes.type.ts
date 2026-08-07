import { SIGNUP_SCOPES } from '../constants';

export type SignupScope = (typeof SIGNUP_SCOPES)[keyof typeof SIGNUP_SCOPES];
