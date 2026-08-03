import { Type } from 'class-transformer';
import { IsDefined, IsObject, IsOptional, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { CreateProductDto } from '@/modules/products/dtos';

import { CreateBranchProductDto } from './create-branch-product.dto';
import { CreateInitialProductBatchDto } from './create-initial-product-batch.dto';

export class OnboardBranchProductDto {
    @ApiPropertyOptional({
        type: CreateProductDto,
    })
    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => CreateProductDto)
    product?: CreateProductDto;

    @ApiProperty({
        type: CreateBranchProductDto,
    })
    @IsDefined()
    @ValidateNested()
    @Type(() => CreateBranchProductDto)
    branch_product!: CreateBranchProductDto;

    @ApiProperty({
        type: CreateInitialProductBatchDto,
    })
    @IsDefined()
    @ValidateNested()
    @Type(() => CreateInitialProductBatchDto)
    initial_batch!: CreateInitialProductBatchDto;
}
