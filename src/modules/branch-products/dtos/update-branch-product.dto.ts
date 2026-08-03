import { PartialType } from '@nestjs/swagger';

import { CreateBranchProductDto } from './create-branch-product.dto';

export class UpdateBranchProductDto extends PartialType(CreateBranchProductDto) {}
