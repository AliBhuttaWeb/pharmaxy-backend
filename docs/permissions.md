# Permissions

## Where they live

All permissions are defined in `src/common/constants/permissions/` — one file per module.
They are all re-exported from `src/common/constants/permissions/index.ts`.

```
src/common/constants/permissions/
├── index.ts                          ← re-exports all permission files
├── products.permissions.ts
├── branch-products.permissions.ts
└── ...
```

---

## Naming convention

| Part | Convention | Example |
|------|-----------|---------|
| Constant object | `SCREAMING_SNAKE_PERMISSIONS` | `PRODUCTS_PERMISSIONS` |
| Key | `<MODEL>_<ACTION>` | `PRODUCT_VIEW_LIST` |
| `name` value | `<module>.<action>` (dot-separated, lowercase) | `products.view.list` |

---

## Permission file template

```ts
// src/common/constants/permissions/products.permissions.ts
export const PRODUCTS_PERMISSIONS = {
    PRODUCT_VIEW_LIST: {
        name: 'products.view.list',
        description: 'View products listing',
    },
    PRODUCT_VIEW_DETAIL: {
        name: 'products.view.detail',
        description: 'View product details',
    },
    PRODUCT_CREATE: {
        name: 'products.create',
        description: 'Create a product',
    },
    PRODUCT_UPDATE: {
        name: 'products.update',
        description: 'Update a product',
    },
    PRODUCT_DELETE: {
        name: 'products.delete',
        description: 'Delete a product',
    },
} as const;
```

Add the export to `src/common/constants/permissions/index.ts`:

```ts
export * from './products.permissions';
```

---

## Using in a controller

Import from `@/common/constants` (the top-level barrel):

```ts
import { PRODUCTS_PERMISSIONS } from '@/common/constants';

@Get()
@Permissions(PRODUCTS_PERMISSIONS.PRODUCT_VIEW_LIST.name)
list() { ... }
```

---

## Seeding permissions

After adding a permissions file, add each permission to `prisma/seeds/permissions.seed.ts` so they exist in the database and can be assigned to roles.
