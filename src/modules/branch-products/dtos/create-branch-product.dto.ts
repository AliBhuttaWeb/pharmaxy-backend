import { Type } from 'class-transformer';
import { IsDefined, IsObject, IsOptional, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { CreateProductDto } from '@/modules/products/dtos';

import { CreateBranchProductItemDto } from './create-branch-product-item.dto';
import { CreateInitialProductBatchDto } from './create-initial-product-batch.dto';

export class CreateBranchProductDto {
    @ApiPropertyOptional({
        type: CreateProductDto,
    })
    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => CreateProductDto)
    product?: CreateProductDto;

    @ApiProperty({
        type: CreateBranchProductItemDto,
    })
    @IsDefined()
    @ValidateNested()
    @Type(() => CreateBranchProductItemDto)
    branch_product!: CreateBranchProductItemDto;

    @ApiProperty({
        type: CreateInitialProductBatchDto,
    })
    @IsDefined()
    @ValidateNested()
    @Type(() => CreateInitialProductBatchDto)
    initial_batch!: CreateInitialProductBatchDto;
}
