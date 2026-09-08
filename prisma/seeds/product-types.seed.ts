import { MESSAGES } from 'prisma/seed.messages';
import { SeedContext } from '../seed.type';
import productTypesData from '../data/product-types.json';

export async function seedProductTypes({ prisma }: SeedContext) {
    for (const type of productTypesData.productTypes) {
        await prisma.productType.upsert({
            where: {
                name: type.name,
            },

            update: {
                description: type.description,
            },

            create: {
                name: type.name,
                description: type.description,
            },
        });
    }

    console.log(MESSAGES.SUCCESS.PRODUCT_TYPES_SEEDED);
}
