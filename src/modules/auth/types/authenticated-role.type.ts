import { ApiProperty } from '@nestjs/swagger';

import { RoleScope, SignupScope } from '@gen/prisma/enums';

export class AuthenticatedRole {
    @ApiProperty()
    id!: string;

    @ApiProperty()
    name!: string;

    @ApiProperty({
        enum: RoleScope,
    })
    role_scope!: RoleScope;

    @ApiProperty({
        enum: SignupScope,
        nullable: true,
    })
    signup_scope!: SignupScope | null;
}
