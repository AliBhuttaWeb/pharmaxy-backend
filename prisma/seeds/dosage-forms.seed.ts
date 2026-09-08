import { MESSAGES } from 'prisma/seed.messages';
import { SeedContext } from '../seed.type';
import dosageFormsData from '../data/dosage-forms.json';

export async function seedDosageForms({ prisma }: SeedContext) {
    for (const dosageForm of dosageFormsData.dosageForms) {
        await prisma.dosageForm.upsert({
            where: {
                name: dosageForm.name,
            },

            update: {
                description: dosageForm.description,
            },

            create: {
                name: dosageForm.name,
                description: dosageForm.description,
            },
        });
    }

    console.log(MESSAGES.SUCCESS.DOSAGE_FORMS_SEEDED);
}
