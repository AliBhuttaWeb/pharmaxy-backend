# Prisma Schema Conventions

## File location

`prisma/schema.prisma` — single schema file.  
Generated client outputs to `generated/prisma` (import from `@gen/prisma/client`).

---

## Model conventions

```prisma
model Product {
  id String @id @default(uuid()) @db.Uuid

  // Foreign keys first, grouped by relation
  manufacturer_id String @db.Uuid
  manufacturer    Manufacturer @relation(fields: [manufacturer_id], references: [id])

  // Fields — snake_case, explicit db type
  name         String  @db.VarChar(255)
  generic_name String  @db.VarChar(255)
  is_active    Boolean @default(true)
  deleted_at   DateTime?           // soft delete — every model that supports deletion

  // Timestamps last
  created_at DateTime @default(now())
  updated_at DateTime @updatedAt

  @@index([manufacturer_id])        // index every FK
  @@map("products")                 // explicit plural snake_case table name
}
```

---

## Rules

| Rule | Detail |
|------|--------|
| IDs | `String @id @default(uuid()) @db.Uuid` |
| Field names | `snake_case` |
| Table names | `@@map("plural_snake_case")` — always explicit |
| Enum names | `@@map("snake_case")` |
| FK fields | index with `@@index([field_id])` |
| Unique combos | `@@unique([field_a, field_b])` |
| Soft delete | `deleted_at DateTime?` — filter `deleted_at: null` in all queries |
| Timestamps | `created_at @default(now())` + `updated_at @updatedAt` on every model |
| String lengths | always set `@db.VarChar(n)` or `@db.Text` — never bare `String` |

---

## Enums

```prisma
enum UserStatus {
  ACTIVE
  INACTIVE
  SUSPENDED

  @@map("user_status")
}
```

Import in TypeScript from `@gen/prisma/enums` (not `@gen/prisma/client`).

---

## Migrations

```bash
# after editing schema.prisma
pnpm prisma migrate dev --name describe_the_change
```

Never edit migration SQL files manually.

---

## Seeding

Seed files live in `prisma/seeds/`. Run via:

```bash
pnpm prisma db seed
```
