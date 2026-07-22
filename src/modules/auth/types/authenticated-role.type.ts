import { ApiProperty } from '@nestjs/swagger';

import { ROLES } from '@/common/constants/roles.constants';
import type { Role } from '@/common/types/role.type';

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
