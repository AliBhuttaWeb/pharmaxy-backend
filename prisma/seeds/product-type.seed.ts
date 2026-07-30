import { MESSAGES } from 'prisma/seed.messages';
import { SeedContext } from '../seed.type';

const PRODUCT_TYPES = [
    {
        name: 'Medicine',
        description: 'Prescription and over-the-counter medicines',
    },
    {
        name: 'Supplement',
        description: 'Vitamins, minerals and health supplements',
    },
    {
        name: 'Medical Device',
        description: 'Medical equipment and devices',
    },
    {
        name: 'Surgical Item',
        description: 'Surgical and clinical-use items',
    },
    {
        name: 'Personal Care',
        description: 'Personal hygiene and personal care products',
    },
    {
        name: 'Cosmetic',
        description: 'Beauty and cosmetic products',
    },
    {
        name: 'Baby Care',
        description: 'Baby and infant care products',
    },
    {
        name: 'FMCG',
        description: 'Fast moving consumer goods',
    },
    {
        name: 'Food & Beverage',
        description: 'Food and drink products',
    },
    {
        name: 'Other',
        description: 'Other retail products',
    },
];

export async function seedProductTypes({ prisma }: SeedContext) {
    for (const type of PRODUCT_TYPES) {
        await prisma.productType.upsert({
            where: {
                name: type.name,
            },

            update: {
                description: type.description,
            },

            create: type,
        });
    }

    console.log(MESSAGES.SUCCESS.PRODUCT_TYPES_SEEDED);
}