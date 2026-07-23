# Pharmaxy Backend Engineering Guidelines

## 1. Project Overview

Pharmaxy is a multi-tenant Pharmacy POS & Inventory SaaS platform.

The backend is designed to support:

- Multiple pharmacies
- Multiple branches per pharmacy
- Pharmacy owners and staff
- POS operations
- Inventory management
- Purchase workflows
- Sales and invoices
- Subscription management
- Payment processing
- Notifications
- Future pharmacy storefronts
- Ecommerce capabilities
- Mobile applications
- Third-party integrations


The system must be designed for:

- Scalability
- Maintainability
- Security
- High performance
- Clear separation of responsibilities
- Future feature expansion


---

# 2. Core Engineering Principles

## 2.1 Clean Architecture

The application follows a layered architecture.

The dependency direction must always be:



---

# 3. Responsibility Separation


## 3.1 Controller Layer

Controllers are responsible for:

- HTTP handling
- Request validation
- Calling services
- Returning responses
- Swagger documentation
- Route definitions


Controllers must NOT contain:

- Business logic
- Database queries
- Permission checks
- Complex calculations
- Data transformation logic


Example:


Good:

```ts
@Post()
create(
    @Body() dto: CreateProductDto,
) {
    return this.productService.create(dto);
}
```

Bad:

```ts
@Post()
async create(@Body() dto: CreateProductDto) {
    const existing = await this.prisma.product.findUnique({ where: { name: dto.name } });
    if (existing) throw new BadRequestException();
    // ...
}
```

## 3.2 Service Layer

Services are responsible for:

- Business logic
- Orchestrating calls to multiple repositories or other services
- Validation of business rules
- Error throwing (e.g. `NotFoundException`, `ForbiddenException`)

Services must NOT contain:

- Direct Prisma/database calls (`this.prisma...` should not exist here)
- Request/Response HTTP objects

## 3.3 Repository Layer

Repositories are responsible for:

- All direct database access (`this.prisma...`)
- Complex queries
- Transaction management

Repositories must NOT contain:

- Business logic or validations that belong in services
- HTTP specific logic

---

# 4. Tech Stack & Project Structure

## 4.1 Tech Stack
- **Framework:** NestJS
- **Language:** TypeScript
- **ORM:** Prisma
- **Authentication:** JWT, Passport
- **Database:** PostgreSQL (implied by typical Prisma usage)

## 4.2 Project Structure
The `src/` directory is organized as follows:

- `common/`: Cross-cutting concerns such as decorators, exceptions, filters, guards, interceptors, pagination, and shared types.
- `config/`: Application configuration files.
- `database/`: Prisma schema, seeders, transaction utilities, and shared/base repositories.
- `modules/`: Feature-based modules (e.g., `auth`). Each module typically contains:
  - `controllers/`: HTTP route handlers.
  - `services/`: Business logic.
  - `repositories/`: Database access.
  - `dtos/`: Data Transfer Objects for validation.
  - `types/` & `constants/`: Module-specific types and constants.
  - `strategies/`: Authentication strategies (e.g., JWT).