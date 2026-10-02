# Pharmaxy Backend — Engineering Guidelines

> Multi-tenant Pharmacy POS & Inventory SaaS — NestJS · Prisma · PostgreSQL · pnpm · Node 25

---

## Quick Reference

```
Controller → Service → Repository → Prisma
```

| Layer | Does | Never does |
|-------|------|------------|
| Controller | HTTP, call one service method | Business logic, DB access |
| Service | Business logic, throw exceptions | `this.prisma.*`, other module's repositories |
| Repository | All `this.prisma.*` | Business logic, throw exceptions |

**Cross-module:** service calls another module's **service**, never its repository.  
**Exports:** export **services**; repositories only when a sibling repository genuinely needs direct DB access.  
**Strings:** no inline strings anywhere — every module owns a `constants/messages.constants.ts`.  
**Permissions:** every non-public route requires `@Permissions(...)`.

---

## Deep Dives

| Topic | File |
|-------|------|
| Module structure & file naming | [docs/module.md](./docs/module.md) |
| DTOs | [docs/dtos.md](./docs/dtos.md) |
| Repository patterns | [docs/repository.md](./docs/repository.md) |
| Service patterns | [docs/service.md](./docs/service.md) |
| Controller patterns | [docs/controller.md](./docs/controller.md) |
| Permissions | [docs/permissions.md](./docs/permissions.md) |
| Prisma schema conventions | [docs/schema.md](./docs/schema.md) |
| Adding a new module (checklist) | [docs/new-module.md](./docs/new-module.md) |

---

## Tech Stack

| | |
|-|-|
| Framework | NestJS |
| ORM | Prisma (output → `generated/prisma`) |
| Database | PostgreSQL |
| Auth | JWT + Passport |
| Package manager | pnpm |
| Node | 25 (`nvm use 25`) |
| Build | `pnpm run build` |
