# DTOs

## One DTO per operation

| Operation | File | Class |
|-----------|------|-------|
| Create | `create-<name>.dto.ts` | `CreateXDto` |
| Update | `update-<name>.dto.ts` | `UpdateXDto` |
| List / filter | `<name>-query.dto.ts` | `XQueryDto` |
| Status update | `update-<name>-status.dto.ts` | `UpdateXStatusDto` |

---

## Create DTO

Every field must have a `class-validator` decorator and an `@ApiProperty` / `@ApiPropertyOptional` decorator.

```ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsUUID, IsOptional, IsBoolean, MaxLength } from 'class-validator';

export class CreateProductDto {
    @ApiProperty({ example: 'Panadol 500mg', maxLength: 255 })
    @IsString()
    @MaxLength(255)
    name!: string;

    @ApiProperty()
    @IsUUID()
    manufacturer_id!: string;

    @ApiPropertyOptional({ default: true })
    @IsOptional()
    @IsBoolean()
    is_active?: boolean;
}
```

---

## Update DTO

Always extends `PartialType(CreateXDto)` — never duplicate fields.

```ts
import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {}
```

---

## Query DTO

Extends `PaginationQueryDto` from `@/common/pagination` which already includes:
`page`, `limit`, `search`, `sort_by`, `sort_order`, `pharmacy_id`, `branch_id`, `is_deleted`.

Add only domain-specific filters:

```ts
import { PaginationQueryDto } from '@/common/pagination';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export class ProductQueryDto extends PaginationQueryDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsUUID()
    manufacturer_id?: string;
}
```

---

## index.ts barrel

Every `dtos/index.ts` re-exports all DTOs in the folder:

```ts
export * from './create-product.dto';
export * from './update-product.dto';
export * from './product-query.dto';
```

Import anywhere via `import { CreateProductDto } from '../dtos'`.

---

## Boolean query params

Query strings arrive as strings. Use `@Transform` to coerce:

```ts
@ApiPropertyOptional()
@IsOptional()
@Transform(({ value }) => value === 'true')
@IsBoolean()
is_active?: boolean;
```
