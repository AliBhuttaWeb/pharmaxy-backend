import { Prisma } from '@gen/prisma/client';

export const existsExtension = Prisma.defineExtension({
    name: 'exists',

    model: {
        $allModels: {
            async exists<T>(this: T, where: Prisma.Args<T, 'findFirst'>['where']) {
                const context = Prisma.getExtensionContext(this);

                const result = await (context as any).findFirst({
                    where,
                });

                return !!result;
            },
        },
    },
});
