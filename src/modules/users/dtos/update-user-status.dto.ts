import { ApiProperty } from '@nestjs/swagger';
import { UserStatus } from '@gen/prisma/enums';

import { IsEnum } from 'class-validator';

export class UpdateUserStatusDto {
    @ApiProperty({
        enum: UserStatus,
    })
    @IsEnum(UserStatus)
    status!: UserStatus;
}
