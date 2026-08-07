import { ApiProperty } from '@nestjs/swagger';
import { AuthenticatedRole } from '../types';

export class LoginResultDto {
    @ApiProperty()
    id!: string;

    @ApiProperty()
    first_name!: string;

    @ApiProperty({ nullable: true })
    last_name!: string | null;

    @ApiProperty()
    email!: string;

    @ApiProperty({ nullable: true })
    phone!: string | null;

    @ApiProperty()
    is_email_verified!: boolean;

    @ApiProperty()
    is_phone_verified!: boolean;

    @ApiProperty({ nullable: true })
    pharmacy_id!: string | null;

    @ApiProperty({
        type: [AuthenticatedRole],
    })
    roles!: AuthenticatedRole[];

    @ApiProperty()
    accessToken!: string;

    @ApiProperty()
    refreshToken!: string;
}
