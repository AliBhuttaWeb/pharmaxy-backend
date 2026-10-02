# Service Patterns

## Rules

- All exceptions thrown here (`NotFoundException`, `ConflictException`, `ForbiddenException`, etc.).
- Call **own repositories** directly.
- Call **other modules' services** for cross-module work — never their repositories.
- No `this.prisma.*` in services.
- Import `MESSAGES` from `'../constants'` — no inline strings.

---

## Standard CRUD service

```ts
@Injectable()
export class ProductsService {
    constructor(
        private readonly productsRepository: ProductsRepository,
        private readonly manufacturersService: ManufacturersService, // cross-module via service
    ) {}

    async findMany(query: ProductQueryDto) {
        const { limit, page } = query;
        const { records, total } = await this.productsRepository.findMany(query);
        if (!total || !page || !limit) return { records };
        const pagination = buildPaginationMeta({ currentPage: page, limit, totalRecords: total });
        return { records, pagination };
    }

    async findById(id: string) {
        const product = await this.productsRepository.findById(id);
        if (!product) throw new NotFoundException(MESSAGES.ERROR.NOT_FOUND);
        return { product };
    }

    async create(dto: CreateProductDto) {
        // validate relations via other modules' services
        await this.manufacturersService.findById(dto.manufacturer_id);

        const product = await this.productsRepository.create(dto);
        return { product, message: MESSAGES.SUCCESS.CREATED };
    }

    async update(id: string, dto: UpdateProductDto) {
        await this.findById(id); // reuse own findById for the not-found check
        const product = await this.productsRepository.update(id, dto);
        return { product, message: MESSAGES.SUCCESS.UPDATED };
    }

    async delete(id: string) {
        await this.findById(id);
        await this.productsRepository.delete(id);
        return { message: MESSAGES.SUCCESS.DELETED };
    }
}
```

---

## Transactions

Use `this.prisma.$transaction` only in the service when multiple write operations must be atomic.
Pass the `tx` client down to every repository method involved.

```ts
await this.prismaService.$transaction(async (tx) => {
    const user = await this.usersRepository.create(userData, tx);
    await this.userBranchesRepository.create({ user_id: user.id, branch_id }, tx);
});
```

---

## Pagination helper

Always use `buildPaginationMeta` from `@/common/pagination`:

```ts
const pagination = buildPaginationMeta({ currentPage: page, limit, totalRecords: total });
return { records, pagination };
```

If query has no `page`/`limit`, return `{ records }` without pagination meta.
