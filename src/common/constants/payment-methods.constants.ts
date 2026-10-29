import { PaymentMethodType } from '@gen/prisma/enums';

export const PAYMENT_METHOD_CODES = {
    CASH: 'CASH',
    CARD: 'CARD',
    BANK_TRANSFER: 'BANK_TRANSFER',
    JAZZCASH: 'JAZZCASH',
    EASYPAISA: 'EASYPAISA',
    CREDIT: 'CREDIT',
} as const;

export const PAYMENT_METHODS = [
    {
        name: 'Cash',
        code: PAYMENT_METHOD_CODES.CASH,
        type: PaymentMethodType.CASH,
        providerCode: null,
        requires_reference: false,
        display_order: 1,
    },

    {
        name: 'Card',
        code: PAYMENT_METHOD_CODES.CARD,
        type: PaymentMethodType.CARD,
        providerCode: null,
        requires_reference: false,
        display_order: 2,
    },

    {
        name: 'Bank Transfer',
        code: PAYMENT_METHOD_CODES.BANK_TRANSFER,
        type: PaymentMethodType.BANK_TRANSFER,
        providerCode: null,
        requires_reference: true,
        display_order: 3,
    },

    {
        name: 'JazzCash',
        code: PAYMENT_METHOD_CODES.JAZZCASH,
        type: PaymentMethodType.DIGITAL_WALLET,
        providerCode: 'JAZZCASH',
        requires_reference: true,
        display_order: 4,
    },

    {
        name: 'Easypaisa',
        code: PAYMENT_METHOD_CODES.EASYPAISA,
        type: PaymentMethodType.DIGITAL_WALLET,
        providerCode: 'EASYPAISA',
        requires_reference: true,
        display_order: 5,
    },

    {
        name: 'Credit',
        code: PAYMENT_METHOD_CODES.CREDIT,
        type: PaymentMethodType.CREDIT,
        providerCode: null,
        requires_reference: false,
        display_order: 6,
    },
];
