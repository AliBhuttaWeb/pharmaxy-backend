import { MESSAGES } from 'prisma/seed.messages';
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
    {
        name: 'Johnson & Johnson',
        description: 'Global healthcare and pharmaceutical company.',
    },
    {
        name: 'Procter & Gamble',
        description: 'Global consumer health and pharmaceutical products company.',
    },
    {
        name: 'AstraZeneca',
        description: 'Global pharmaceutical and biotechnology company.',
    },
    {
        name: 'Reckitt',
        description: 'Global consumer health and hygiene products company.',
    },
    {
        name: 'Merck',
        description: 'Global pharmaceutical and healthcare company.',
    },
    {
        name: 'Allergan',
        description: 'Global pharmaceutical company.',
    },
    {
        name: 'Servier',
        description: 'International pharmaceutical company.',
    },
    {
        name: 'Beiersdorf',
        description: 'Multinational skin care company.',
    },
    {
        name: 'Leo Pharma',
        description: 'Multinational pharmaceutical company.',
    },
    {
        name: 'Nestle',
        description: 'Multinational food and drink processing conglomerate.',
    },
    {
        name: 'Kimberly-Clark',
        description: 'Multinational personal care corporation.',
    },
    {
        name: 'Hamdard',
        description: 'Herbal and unani medicine manufacturer in Pakistan.',
    },
    {
        name: 'Colgate-Palmolive',
        description: 'Multinational consumer products company.',
    },
    {
        name: 'Alcon',
        description: 'Global medical company specializing in eye care products.',
    },
    {
        name: 'Unilever',
        description: 'Multinational consumer goods company.',
    },
    {
        name: 'Haleon',
        description: 'Multinational consumer healthcare company.',
    },
    {
        name: 'Nutrifactor',
        description: 'Leading nutraceutical company in Pakistan.',
    },
    {
        name: 'Herbiotics',
        description: 'Nutritional supplements manufacturer in Pakistan.',
    },
    {
        name: 'Qarshi',
        description: 'Leading natural products manufacturer in Pakistan.',
    },
    {
        name: 'Safi',
        description: 'Herbal medicine.',
    },
    {
        name: 'Brookes Pharma',
        description: 'Pharmaceutical company in Pakistan.',
    },
    { name: 'CCL Pharmaceuticals', description: 'Pakistani pharmaceutical company.' },
    { name: 'Scilife Pharma', description: 'Pharmaceutical company in Pakistan.' },
    { name: 'Bona Papa', description: 'Baby care manufacturer.' },
    { name: 'Hayat Kimya', description: 'Manufacturer of Molfix diapers.' },
    { name: 'Ontex', description: 'Global hygiene solutions.' },
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

    console.log(MESSAGES.SUCCESS.MANUFACTURERS_SEEDED);
}
