# Module Structure & File Naming

## Folder layout

```
src/modules/<kebab-case-name>/
├── constants/
│   ├── index.ts
│   └── messages.constants.ts
├── controllers/
│   └── <name>.console.controller.ts
├── dtos/
│   ├── index.ts
│   ├── create-<name>.dto.ts
│   ├── update-<name>.dto.ts
│   └── <name>-query.dto.ts
├── repositories/
│   └── <name>.repository.ts
├── services/
│   └── <name>.service.ts
└── <name>.module.ts
```

Optional (add only when needed): `helpers/`, `types/`, `strategies/`, `decorators/`

---

## File naming rules

| File | Convention | Example |
|------|-----------|---------|
| Module folder | `kebab-case` | `branch-products/` |
| Module file | `<name>.module.ts` | `branch-products.module.ts` |
| Controller | `<name>.console.controller.ts` | `branch-products.console.controller.ts` |
| Service | `<name>.service.ts` | `branch-products.service.ts` |
| Repository | `<name>.repository.ts` | `branch-products.repository.ts` |
| DTO | `<operation>-<name>.dto.ts` | `create-branch-product.dto.ts` |
| Query DTO | `<name>-query.dto.ts` | `branch-product-query.dto.ts` |
| Messages constants | `messages.constants.ts` | `messages.constants.ts` |
| Permissions | `<name>.permissions.ts` | `branch-products.permissions.ts` |

---

## Class naming rules

| File | Convention | Example |
|------|-----------|---------|
| Module | `PascalCase + Module` | `BranchProductsModule` |
| Controller | `PascalCase + ConsoleController` | `BranchProductsConsoleController` |
| Service | `PascalCase + Service` | `BranchProductsService` |
| Repository | `PascalCase + Repository` | `BranchProductsRepository` |
| DTO | `PascalCase + Dto` | `CreateBranchProductDto` |
| Permissions const | `SCREAMING_SNAKE + _PERMISSIONS` | `BRANCH_PRODUCTS_PERMISSIONS` |

---

## Module file

```ts
@Module({
    imports: [OtherModule],           // modules whose services this module needs
    controllers: [XConsoleController],
    providers: [XService, XRepository],
    exports: [XService],              // services only — never repositories unless truly needed cross-repo
})
export class XModule {}
```
