import { SeedContext } from '../seed.type';

const RETAIL_CATEGORIES = [
    // Medicines
    {
        name: 'Pain Relief',
        description: 'Pain killers and analgesics',
    },
    {
        name: 'Antibiotics',
        description: 'Antibiotic medicines',
    },
    {
        name: 'Cold & Flu',
        description: 'Cold, cough and flu products',
    },
    {
        name: 'Gastrointestinal',
        description: 'Digestive system medicines',
    },
    {
        name: 'Diabetes Care',
        description: 'Diabetes medicines and supplies',
    },
    {
        name: 'Cardiac Care',
        description: 'Heart related medicines',
    },
    {
        name: 'Dermatology',
        description: 'Skin related medicines',
    },
    {
        name: 'Eye Care',
        description: 'Eye drops and eye medicines',
    },
    {
        name: 'ENT Care',
        description: 'Ear, nose and throat products',
    },


    // Supplements
    {
        name: 'Vitamins',
        description: 'Vitamin supplements',
    },
    {
        name: 'Protein Supplements',
        description: 'Protein and fitness supplements',
    },


    // Personal Care
    {
        name: 'Skin Care',
        description: 'Skin creams, lotions and treatments',
    },
    {
        name: 'Hair Care',
        description: 'Shampoo, oils and hair products',
    },
    {
        name: 'Oral Care',
        description: 'Toothpaste, toothbrush and mouth care',
    },
    {
        name: 'Bath & Hygiene',
        description: 'Soap, body wash and hygiene products',
    },


    // Baby
    {
        name: 'Baby Food',
        description: 'Baby nutrition products',
    },
    {
        name: 'Baby Hygiene',
        description: 'Diapers, wipes and baby care',
    },


    // Medical
    {
        name: 'Surgical Supplies',
        description: 'Bandages, gloves and surgical items',
    },
    {
        name: 'Medical Equipment',
        description: 'BP machines, thermometers etc.',
    },


    // FMCG
    {
        name: 'Beverages',
        description: 'Water, juices and drinks',
    },
    {
        name: 'Snacks',
        description: 'Chocolates, biscuits and snacks',
    },
    {
        name: 'Household Items',
        description: 'General household products',
    },


    // Other
    {
        name: 'Sexual Wellness',
        description: 'Condoms and sexual wellness products',
    },
];

export async function seedRetailCategories({ prisma }: SeedContext) {
    for (const category of RETAIL_CATEGORIES) {
        await prisma.retailCategory.upsert({
            where: {
                name: category.name,
            },

            update: {
                description: category.description,
            },

            create: category,
        });
    }
}