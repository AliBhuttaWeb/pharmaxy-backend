import { PartialType } from '@nestjs/swagger';

import { BranchProductFieldsDto } from './branch-product-fields.dto';

export class UpdateBranchProductDto extends PartialType(BranchProductFieldsDto) {}
