import { MESSAGES } from 'prisma/seed.messages';
import { SeedContext } from '../seed.type';
import { PAYMENT_METHODS, PAYMENT_PROVIDERS } from '@/common/constants';

export async function seedPaymentMethods({ prisma }: SeedContext) {
    const providers = await prisma.paymentProvider.findMany({
        select: {
            id: true,
            code: true,
        },
    });

    const providerMap = new Map(providers.map((provider) => [provider.code, provider.id]));

    for (const method of PAYMENT_METHODS) {
        await prisma.paymentMethod.upsert({
            where: {
                code: method.code,
            },
            update: {
                name: method.name,
                type: method.type,
                provider_id: method.providerCode
                    ? (providerMap.get(method.providerCode) ?? null)
                    : null,
                requires_reference: method.requires_reference,
                display_order: method.display_order,
                is_active: true,
            },
            create: {
                name: method.name,
                code: method.code,
                type: method.type,
                provider_id: method.providerCode
                    ? (providerMap.get(method.providerCode) ?? null)
                    : null,
                requires_reference: method.requires_reference,
                display_order: method.display_order,
            },
        });
    }

    console.log(MESSAGES.SUCCESS.PAYMENT_METHODS_SEEDED);
}
