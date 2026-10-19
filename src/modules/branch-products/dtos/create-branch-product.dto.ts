import { Type } from 'class-transformer';
import { IsDefined, IsObject, IsOptional, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { CreateProductDto } from '@/modules/products/dtos';

import { CreateBranchProductItemDto } from './create-branch-product-item.dto';
import { CreateInitialBranchProductBatchDto } from './create-initial-branch-product-batch.dto';

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
        type: CreateInitialBranchProductBatchDto,
    })
    @IsDefined()
    @ValidateNested()
    @Type(() => CreateInitialBranchProductBatchDto)
    initial_batch!: CreateInitialBranchProductBatchDto;
}
