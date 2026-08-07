import { ApiProperty } from '@nestjs/swagger';
import { UserStatus } from '@prisma/client';

import { AuthenticatedRole } from './authenticated-role.type';

export class AuthenticatedUser {
    @ApiProperty()
    id!: string;

    @ApiProperty()
    email!: string;

    @ApiProperty({ nullable: true })
    phone!: string | null;

    @ApiProperty()
    first_name!: string;

    @ApiProperty({ nullable: true })
    last_name!: string | null;

    @ApiProperty({
        enum: UserStatus,
    })
    status!: UserStatus;

    @ApiProperty({
        nullable: true,
        example: 'pharmacy-uuid',
    })
    pharmacy_id!: string | null;

    @ApiProperty({
        nullable: true,
        example: 'branch-uuid',
    })
    branch_id!: string | null;

    @ApiProperty()
    is_email_verified!: boolean;

    @ApiProperty()
    is_phone_verified!: boolean;

    @ApiProperty({
        type: () => [AuthenticatedRole],
    })
    roles!: AuthenticatedRole[];
}
