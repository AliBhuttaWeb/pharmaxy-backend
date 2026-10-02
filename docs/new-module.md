# Adding a New Module — Checklist

Use this when adding a brand-new feature module. Follow the steps in order.

---

## 1. Create the folder structure

```bash
src/modules/<name>/
├── constants/
├── controllers/
├── dtos/
├── repositories/
├── services/
└── <name>.module.ts
```

→ See [module.md](./module.md) for naming conventions.

---

## 2. Constants

Create `constants/messages.constants.ts`:

```ts
export const MESSAGES = {
    SUCCESS: {
        CREATED: '<Entity> created successfully.',
        UPDATED: '<Entity> updated successfully.',
        DELETED: '<Entity> deleted successfully.',
    },
    ERROR: {
        NOT_FOUND: '<Entity> not found.',
        ALREADY_EXISTS: '<Entity> already exists.',
    },
} as const;
```

Create `constants/index.ts`:

```ts
export * from './messages.constants';
```

→ See [service.md](./service.md) for usage.

---

## 3. Permissions

Create `src/common/constants/permissions/<name>.permissions.ts`:

```ts
export const <NAME>_PERMISSIONS = {
    <NAME>_VIEW_LIST:   { name: '<module>.view.list',   description: '...' },
    <NAME>_VIEW_DETAIL: { name: '<module>.view.detail', description: '...' },
    <NAME>_CREATE:      { name: '<module>.create',      description: '...' },
    <NAME>_UPDATE:      { name: '<module>.update',      description: '...' },
    <NAME>_DELETE:      { name: '<module>.delete',      description: '...' },
} as const;
```

Add to `src/common/constants/permissions/index.ts`:

```ts
export * from './<name>.permissions';
```

Seed the permissions in `prisma/seeds/permissions.seed.ts`.

→ See [permissions.md](./permissions.md) for full details.

---

## 4. DTOs

| File | Extends |
|------|---------|
| `create-<name>.dto.ts` | — |
| `update-<name>.dto.ts` | `PartialType(CreateXDto)` |
| `<name>-query.dto.ts` | `PaginationQueryDto` |

Create `dtos/index.ts` re-exporting all DTOs.

→ See [dtos.md](./dtos.md) for field decorators and patterns.

---

## 5. Repository

- One file per Prisma model.
- `private readonly relations` for shared includes.
- `tx?` on all write methods.

→ See [repository.md](./repository.md) for full patterns.

---

## 6. Service

- Inject own repositories.
- Inject other modules' services (not repositories) for cross-module calls.
- Import `MESSAGES` from `'../constants'`.
- Use `buildPaginationMeta` for list endpoints.

→ See [service.md](./service.md) for full patterns.

---

## 7. Controller

- Use `@ConsoleController('<route>')`.
- `@Permissions(X_PERMISSIONS.X_ACTION.name)` on every handler.
- `@CurrentUser()` where the user is needed.
- `@Param('id', new ParseUUIDPipe())` on all `:id` params.

→ See [controller.md](./controller.md) for full example.

---

## 8. Module file

```ts
@Module({
    imports: [OtherModule],
    controllers: [XConsoleController],
    providers: [XService, XRepository],
    exports: [XService],
})
export class XModule {}
```

Register `XModule` in `app.module.ts`.
