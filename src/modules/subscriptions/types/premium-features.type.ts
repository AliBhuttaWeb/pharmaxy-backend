import { PREMIUM_FEATUIRES } from '../constants';

export type PremiumFeatures = (typeof PREMIUM_FEATUIRES)[keyof typeof PREMIUM_FEATUIRES];
