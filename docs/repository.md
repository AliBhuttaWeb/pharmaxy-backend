# Repository Patterns

## One repository per Prisma model

```
UsersRepository        → User model
ProductBatchesRepository → ProductBatch model
```

If a module has two models, it has two repositories.

---

## Structure

```ts
@Injectable()
export class ProductsRepository {
    constructor(private readonly prisma: PrismaService) {}

    // Shared include/select — declare once, reuse everywhere
    private readonly relations: Prisma.ProductInclude = {
        manufacturer: true,
        dosage_form: true,
    };

    findMany(query: ProductQueryDto) { ... }

    findById(id: string, tx?: Prisma.TransactionClient) {
        return this.prisma.getClient(tx).product.findFirst({
            where: { id, deleted_at: null },
            include: this.relations,
        });
    }

    create(data: CreateProductDto, tx?: Prisma.TransactionClient) {
        return this.prisma.getClient(tx).product.create({
            data,
            include: this.relations,
        });
    }

    update(id: string, data: UpdateProductDto, tx?: Prisma.TransactionClient) {
        return this.prisma.getClient(tx).product.update({
            where: { id },
            data,
            include: this.relations,
        });
    }

    // Soft delete — set deleted_at, never hard delete unless justified
    delete(id: string, tx?: Prisma.TransactionClient) {
        return this.prisma.getClient(tx).product.update({
            where: { id },
            data: { deleted_at: new Date() },
        });
    }
}
```

---

## Rules

- Always filter `deleted_at: null` in `findMany` / `findById` (soft deletes).
- `tx?` parameter on every write method — pass it through to `this.prisma.getClient(tx)`.
- Declare `private readonly relations` at the top — never inline the same include twice.
- **Nested writes:** use the **checked** (`CreateInput`) form with `relation: { connect: { id } }`. Do not mix unchecked scalar IDs with nested `create`:

```ts
// ✅ Correct — checked form
const data: Prisma.SupportTicketCreateInput = {
    pharmacy: { connect: { id: pharmacyId } },
    creator: { connect: { id: userId } },
    messages: { create: { user: { connect: { id: userId } }, message: dto.message } },
};

// ❌ Wrong — mixing unchecked scalars with nested create
data = {
    pharmacy_id: pharmacyId,
    created_by: userId,
    messages: { create: { sender_id: userId, message: dto.message } },
};
```

---

## Paginated findMany pattern

```ts
async findMany(query: ProductQueryDto) {
    const { page, limit, search, sort_by, sort_order } = query;

    const where: Prisma.ProductWhereInput = {
        deleted_at: null,
        ...(search && { name: { contains: search, mode: 'insensitive' } }),
    };

    const orderBy = { [(sort_by ?? 'created_at')]: sort_order ?? 'desc' };

    const isPaginated = page !== undefined && limit !== undefined;

    if (!isPaginated) {
        const records = await this.prisma.product.findMany({ where, orderBy, include: this.relations });
        return { records };
    }

    const [records, total] = await this.prisma.$transaction([
        this.prisma.product.findMany({ where, orderBy, skip: (page - 1) * limit, take: limit, include: this.relations }),
        this.prisma.product.count({ where }),
    ]);

    return { records, total };
}
```
