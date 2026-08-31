import { MESSAGES } from 'prisma/seed.messages';
import { SeedContext } from '../seed.type';
import { PAYMENT_PROVIDERS } from '@/common/constants';

export async function seedPaymentProviders({ prisma }: SeedContext) {
    for (const provider of PAYMENT_PROVIDERS) {
        await prisma.paymentProvider.upsert({
            where: {
                code: provider.code,
            },
            update: {
                name: provider.name,
                is_active: true,
            },
            create: provider,
        });
    }

    console.log(MESSAGES.SUCCESS.PAYMENT_PRVIDERS_SEEDED);
}
