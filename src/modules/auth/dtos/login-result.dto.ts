import { ApiProperty } from '@nestjs/swagger';
import { AuthenticatedUser } from '../types';

export class LoginResultDto {
    @ApiProperty()
    accessToken!: string;

    @ApiProperty()
    refreshToken!: string;

    @ApiProperty({
        example: 900,
        description: 'Access token expiration time in seconds',
    })
    @ApiProperty()
    user!: AuthenticatedUser;
}
