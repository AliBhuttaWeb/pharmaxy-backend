import { ApiProperty } from '@nestjs/swagger';
import { UserStatus } from '@prisma/client';

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
        type: [String],
    })
    roles!: string[];

    @ApiProperty({
        type: [String],
    })
    permissions!: string[];
}
