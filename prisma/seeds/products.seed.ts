import { MESSAGES } from 'prisma/seed.messages';
import { SeedContext } from '../seed.type';
import products from '../data/products.json';

export async function seedProducts({ prisma }: SeedContext): Promise<void> {
    for (const product of products.products) {
        const productType = await prisma.productType.findUnique({
            where: {
                name: product.productType,
            },
        });

        if (!productType) {
            throw new Error(
                `Product seed failed: ProductType "${product.productType}" not found for product "${product.name}".`,
            );
        }

        const category = await prisma.retailCategory.findUnique({
            where: {
                name: product.category,
            },
        });

        if (!category) {
            throw new Error(
                `Product seed failed: RetailCategory "${product.category}" not found for product "${product.name}".`,
            );
        }

        const manufacturer = await prisma.manufacturer.findUnique({
            where: {
                name: product.manufacturer,
            },
        });

        if (!manufacturer) {
            throw new Error(
                `Product seed failed: Manufacturer "${product.manufacturer}" not found for product "${product.name}".`,
            );
        }

        const dosageForm = await prisma.dosageForm.findUnique({
            where: {
                name: product.dosageForm,
            },
        });

        if (!dosageForm) {
            throw new Error(
                `Product seed failed: DosageForm "${product.dosageForm}" not found for product "${product.name}".`,
            );
        }

        const data = {
            name: product.name,
            generic_name: product.genericName ?? null, // Also known as formula
            strength: product.strength ?? null,
            pack_quantity: product.packQuantity ?? 1,
            pack_unit: product.packUnit ?? 'Pack',

            manufacturer_id: manufacturer.id,
            product_type_id: productType.id,
            retail_category_id: category.id,
            dosage_form_id: dosageForm.id,

            // requires_prescription: product.productType === 'Medicine',

            is_active: true,
            deleted_at: null,
        };

        const existingProduct = await prisma.product.findFirst({
            where: {
                name: product.name,
                manufacturer_id: manufacturer.id,
                deleted_at: null,
            },
        });

        if (existingProduct) {
            await prisma.product.update({
                where: {
                    id: existingProduct.id,
                },
                data,
            });
        } else {
            await prisma.product.create({
                data,
            });
        }
    }

    console.log(MESSAGES.SUCCESS.PRODUCTS_SEEDED);
}
