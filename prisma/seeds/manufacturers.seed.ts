import { MESSAGES } from 'prisma/seed.messages';
import { SeedContext } from 'prisma/seed.type';
import manufacturersData from '../data/manufacturers.json';

export async function seedManufacturers({ prisma }: SeedContext): Promise<void> {
    for (const manufacturer of manufacturersData.manufacturers) {
        await prisma.manufacturer.upsert({
            where: {
                name: manufacturer.name,
            },
            update: {
                description: manufacturer.description,
            },
            create: {
                name: manufacturer.name,
                description: manufacturer.description,
            },
        });
    }

    console.log(MESSAGES.SUCCESS.MANUFACTURERS_SEEDED);
}
