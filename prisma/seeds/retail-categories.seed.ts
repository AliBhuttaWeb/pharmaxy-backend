import { MESSAGES } from 'prisma/seed.messages';
import { SeedContext } from '../seed.type';
import retailCategoriesData from '../data/retail-categories.json';

export async function seedRetailCategories({ prisma }: SeedContext) {
    for (const category of retailCategoriesData.retailCategories) {
        await prisma.retailCategory.upsert({
            where: {
                name: category.name,
            },

            update: {
                description: category.description,
            },

            create: {
                name: category.name,
                description: category.description,
            },
        });
    }

    console.log(MESSAGES.SUCCESS.RETAIL_CATEGORIES_SEEDED);
}
