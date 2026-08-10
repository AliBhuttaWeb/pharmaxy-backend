import { ApiProperty } from '@nestjs/swagger';
import { AuthenticatedUser } from '../types';

export class ProfileDto {
    @ApiProperty({ type: AuthenticatedUser })
    profile!: AuthenticatedUser;
}
