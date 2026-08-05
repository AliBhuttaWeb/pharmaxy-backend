import { ApiProperty } from '@nestjs/swagger';

import type { AuthFlowStatus } from '../types/auth-flow-status.type';
import { AuthContextDto } from './auth-context.dto';
import { LoginUserDto } from './login-user.dto';

export class LoginResultDto extends AuthContextDto {
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
