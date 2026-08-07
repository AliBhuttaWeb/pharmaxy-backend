import { ApiProperty } from '@nestjs/swagger';

import { UserStatus } from '@gen/prisma/client';

export class LoginUserDto {
    @ApiProperty()
    id!: string;

    @ApiProperty()
    email!: string;

    @ApiProperty()
    firstName!: string;

    @ApiProperty({
        nullable: true,
    })
    lastName!: string | null;

    @ApiProperty({
        enum: UserStatus,
    })
    status!: UserStatus;
}
