import { MESSAGES } from 'prisma/seed.messages';
import { SeedContext } from '../seed.type';
import categoriesData from '../data/categories.json';

export async function seedCategories({ prisma }: SeedContext) {
    for (const category of categoriesData.categories) {
        await prisma.category.upsert({
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

    console.log(MESSAGES.SUCCESS.CATEGORIES_SEEDED);
}
