import { ApiProperty } from '@nestjs/swagger';

import type { AuthFlowStatus } from '../types/auth-flow-status.type';

import { LoginUserDto } from './login-user.dto';

export class LoginResultDto {
    @ApiProperty({
        example: 'COMPLETE',
    })
    authStatus!: AuthFlowStatus;

    @ApiProperty({
        type: LoginUserDto,
    })
    user!: LoginUserDto;

    @ApiProperty()
    accessToken!: string;

    @ApiProperty()
    refreshToken!: string;
}
