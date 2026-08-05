import { ApiProperty } from '@nestjs/swagger';

import { IsUUID } from 'class-validator';

export class DowngradeSubscriptionDto {
    @ApiProperty()
    @IsUUID()
    plan_id!: string;
}
