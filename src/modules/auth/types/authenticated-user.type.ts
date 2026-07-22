import { ApiProperty } from '@nestjs/swagger';
import { UserStatus } from '@prisma/client';

import { AuthenticatedRole } from './authenticated-role.type';

export class AuthenticatedUser {
    @ApiProperty()
    id!: string;

    @ApiProperty()
    email!: string;

    @ApiProperty()
    firstName!: string;

    @ApiProperty({ nullable: true })
    lastName!: string | null;

    @ApiProperty({
        enum: UserStatus,
    })
    status!: UserStatus;

    @ApiProperty({
        nullable: true,
        example: 'branch-uuid',
    })
    activeBranchId!: string | null;

    @ApiProperty({
        type: () => [AuthenticatedRole],
    })
    roles!: AuthenticatedRole[];

    @ApiProperty({
        type: [String],
        example: ['CREATE_INVOICE', 'VIEW_STOCK'],
    })
    permissions!: string[];
}
