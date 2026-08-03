import { Type } from 'class-transformer';

import { IsDefined, IsObject, IsOptional, ValidateNested } from 'class-validator';

import { CreateProductDto } from '@/modules/products/dtos';

import { CreateBranchProductDto } from './create-branch-product.dto';
import { CreateInitialProductBatchDto } from './create-initial-product-batch.dto';

export class OnboardBranchProductDto {
    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => CreateProductDto)
    product?: CreateProductDto;

    @IsDefined()
    @ValidateNested()
    @Type(() => CreateBranchProductDto)
    branch_product!: CreateBranchProductDto;

    @IsDefined()
    @ValidateNested()
    @Type(() => CreateInitialProductBatchDto)
    initial_batch!: CreateInitialProductBatchDto;
}
