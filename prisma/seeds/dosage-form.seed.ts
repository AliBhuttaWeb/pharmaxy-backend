import { MESSAGES } from 'prisma/seed.messages';
import { SeedContext } from '../seed.type';

const DOSAGE_FORMS = [
    {
        name: 'Tablet',
        description: 'Solid oral dosage form containing active ingredients',
    },
    {
        name: 'Capsule',
        description: 'Solid oral dosage form enclosed in a capsule shell',
    },
    {
        name: 'Syrup',
        description: 'Liquid oral dosage form containing dissolved ingredients',
    },
    {
        name: 'Suspension',
        description: 'Liquid dosage form containing suspended particles',
    },
    {
        name: 'Injection',
        description: 'Sterile injectable dosage form',
    },
    {
        name: 'Cream',
        description: 'Semi-solid topical dosage form for skin application',
    },
    {
        name: 'Ointment',
        description: 'Greasy semi-solid topical preparation',
    },
    {
        name: 'Gel',
        description: 'Semi-solid preparation with gel-like consistency',
    },
    {
        name: 'Lotion',
        description: 'Liquid topical preparation applied to skin',
    },
    {
        name: 'Drops',
        description: 'Liquid preparation administered in drops',
    },
    {
        name: 'Spray',
        description: 'Liquid or aerosol preparation applied by spraying',
    },
    {
        name: 'Powder',
        description: 'Dry powdered preparation for oral or topical use',
    },
    {
        name: 'Sachet',
        description: 'Single-use packet containing medicine or supplement',
    },
    {
        name: 'Suppository',
        description: 'Solid dosage form inserted into body cavities',
    },
    {
        name: 'Patch',
        description: 'Transdermal dosage form delivering medicine through skin',
    },
];

export async function seedDosageForms({ prisma }: SeedContext) {
    for (const dosageForm of DOSAGE_FORMS) {
        await prisma.dosageForm.upsert({
            where: {
                name: dosageForm.name,
            },

            update: {
                description: dosageForm.description,
            },

            create: dosageForm,
        });
    }

    console.log(MESSAGES.SUCCESS.DOSAGE_FORMS_SEEDED);
}