# Controller Patterns

## `@ConsoleController`

Never use the plain NestJS `@Controller`. Always use `@ConsoleController` from `@/common/decorators`.
It automatically prefixes the route with `/console/v1/<path>`.

```ts
import { ConsoleController, CurrentUser, Permissions } from '@/common/decorators';
```

---

## Rules

- `@Permissions(...)` on **every** route handler (except `@Public()` routes).
- `@CurrentUser() user: AuthenticatedUser` on any handler that needs the logged-in user.
- `@Param('id', new ParseUUIDPipe())` on all `:id` params — validates UUID format.
- One service call per handler — no logic, no conditions.
- `@ApiOperation` and `@ApiResponse` on every endpoint.

---

## Full CRUD example

```ts
import { Body, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ConsoleController, CurrentUser, Permissions } from '@/common/decorators';
import { PRODUCTS_PERMISSIONS } from '@/common/constants';
import { AuthenticatedUser } from '@/modules/auth/types';
import { CreateProductDto, UpdateProductDto, ProductQueryDto } from '../dtos';
import { ProductsService } from '../services/products.service';

@ConsoleController('products')
export class ProductsConsoleController {
    constructor(private readonly productsService: ProductsService) {}

    @Get()
    @Permissions(PRODUCTS_PERMISSIONS.PRODUCT_VIEW_LIST.name)
    @ApiOperation({ summary: 'List products' })
    list(@Query() query: ProductQueryDto, @CurrentUser() user: AuthenticatedUser) {
        return this.productsService.findMany(query, user);
    }

    @Get(':id')
    @Permissions(PRODUCTS_PERMISSIONS.PRODUCT_VIEW_DETAIL.name)
    @ApiOperation({ summary: 'Get product by ID' })
    get(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.productsService.findById(id);
    }

    @Post()
    @Permissions(PRODUCTS_PERMISSIONS.PRODUCT_CREATE.name)
    @ApiOperation({ summary: 'Create product' })
    create(@Body() dto: CreateProductDto, @CurrentUser() user: AuthenticatedUser) {
        return this.productsService.create(dto, user);
    }

    @Patch(':id')
    @Permissions(PRODUCTS_PERMISSIONS.PRODUCT_UPDATE.name)
    @ApiOperation({ summary: 'Update product' })
    update(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Body() dto: UpdateProductDto,
    ) {
        return this.productsService.update(id, dto);
    }

    @Delete(':id')
    @Permissions(PRODUCTS_PERMISSIONS.PRODUCT_DELETE.name)
    @ApiOperation({ summary: 'Delete product' })
    delete(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.productsService.delete(id);
    }
}
```

---

## Public routes

Use `@Public()` only for unauthenticated endpoints (login, signup, etc.). Never on business routes.

```ts
@Public()
@Post('login')
login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
}
```
