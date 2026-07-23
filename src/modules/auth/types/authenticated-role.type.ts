import { ApiProperty } from '@nestjs/swagger';

import { ROLES } from '@/common/constants';
import type { Role } from '@/common/types';

export class AuthenticatedRole {
    @ApiProperty()
    id!: string;

    @ApiProperty({
        enum: ROLES,
    })
    name!: Role;

    @ApiProperty({
        nullable: true,
    })
    branchId!: string | null;
}
