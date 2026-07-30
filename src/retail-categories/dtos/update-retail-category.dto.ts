import { PartialType } from '@nestjs/swagger';

import { CreateRetailCategoryDto } from './create-retail-category.dto';

export class UpdateRetailCategoryDto extends PartialType(CreateRetailCategoryDto) {}
