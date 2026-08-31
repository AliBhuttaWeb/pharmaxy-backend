import { PaymentMethodType } from '@gen/prisma/enums';

export const PAYMENT_METHODS = [
    {
        name: 'Cash',
        code: 'CASH',
        type: PaymentMethodType.CASH,
        providerCode: null,
        requires_reference: false,
        display_order: 1,
    },

    {
        name: 'Card',
        code: 'CARD',
        type: PaymentMethodType.CARD,
        providerCode: null,
        requires_reference: false,
        display_order: 2,
    },

    {
        name: 'Bank Transfer',
        code: 'BANK_TRANSFER',
        type: PaymentMethodType.BANK_TRANSFER,
        providerCode: null,
        requires_reference: true,
        display_order: 3,
    },

    {
        name: 'JazzCash',
        code: 'JAZZCASH',
        type: PaymentMethodType.DIGITAL_WALLET,
        providerCode: 'JAZZCASH',
        requires_reference: true,
        display_order: 4,
    },

    {
        name: 'Easypaisa',
        code: 'EASYPAISA',
        type: PaymentMethodType.DIGITAL_WALLET,
        providerCode: 'EASYPAISA',
        requires_reference: true,
        display_order: 5,
    },

    {
        name: 'Credit',
        code: 'CREDIT',
        type: PaymentMethodType.CREDIT,
        providerCode: null,
        requires_reference: false,
        display_order: 6,
    },
];
