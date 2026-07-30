import { SeedContext } from 'prisma/seed.type';

const MANUFACTURERS = [
    {
        name: 'Getz Pharma',
        description: 'Leading pharmaceutical manufacturer in Pakistan.',
    },
    {
        name: 'The Searle Company',
        description: 'Pakistani pharmaceutical manufacturer.',
    },
    {
        name: 'Highnoon Laboratories',
        description: 'Manufacturer of prescription and consumer healthcare products.',
    },
    {
        name: 'AGP Limited',
        description: 'Pharmaceutical and healthcare products manufacturer.',
    },
    {
        name: 'Hilton Pharma',
        description: 'Manufacturer of branded pharmaceutical products.',
    },
    {
        name: 'Martin Dow',
        description: 'Pharmaceutical manufacturer operating in Pakistan.',
    },
    {
        name: 'GlaxoSmithKline Pakistan',
        description: 'Global pharmaceutical company operating in Pakistan.',
    },
    {
        name: 'Pfizer Pakistan',
        description: 'Multinational pharmaceutical company.',
    },
    {
        name: 'Abbott Laboratories Pakistan',
        description: 'Healthcare and pharmaceutical manufacturer.',
    },
    {
        name: 'Sanofi Pakistan',
        description: 'Global pharmaceutical manufacturer.',
    },
    {
        name: 'Bosch Pharmaceuticals',
        description: 'Pakistani pharmaceutical manufacturer.',
    },
    {
        name: 'SAMI Pharmaceuticals',
        description: 'Pakistani pharmaceutical manufacturer.',
    },
    {
        name: 'Barrett Hodgson Pakistan',
        description: 'Pharmaceutical manufacturer.',
    },
    {
        name: 'Ferozsons Laboratories',
        description: 'Pakistani pharmaceutical manufacturer.',
    },
    {
        name: 'Tabros Pharma',
        description: 'Manufacturer of pharmaceutical products.',
    },
    {
        name: 'Pharmevo',
        description: 'Pakistani pharmaceutical manufacturer.',
    },
    {
        name: 'OBS Pakistan',
        description: 'Healthcare and pharmaceutical company.',
    },
    {
        name: 'Herbion Pakistan',
        description: 'Herbal and pharmaceutical manufacturer.',
    },
    {
        name: 'Bayer Pakistan',
        description: 'Global pharmaceutical manufacturer.',
    },
    {
        name: 'Novartis Pakistan',
        description: 'Global pharmaceutical company.',
    },
] as const;

export async function seedManufacturers({ prisma }: SeedContext): Promise<void> {
    for (const manufacturer of MANUFACTURERS) {
        await prisma.manufacturer.upsert({
            where: {
                name: manufacturer.name,
            },
            update: {
                description: manufacturer.description,
            },
            create: manufacturer,
        });
    }
}
