## Database Workflow (Prisma 7)

### First migration

npm run db:migrate:dev -- --name init

### Create a new migration

1. Update `prisma/schema.prisma`
2. Run:

npm run db:migrate:dev -- --name <migration-name>

Example:

npm run db:migrate:dev -- --name add-pharmacies

### Production

Never use `db:migrate:dev`.

Use:

npm run db:migrate:deploy

### Generate Prisma Client

After changing the schema:

npm run prisma:generate

### Validate Schema

npm run prisma:validate

### Open Prisma Studio

npm run prisma:studio
