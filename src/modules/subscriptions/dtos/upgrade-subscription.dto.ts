import { ApiProperty } from '@nestjs/swagger';

import { IsUUID } from 'class-validator';

export class UpgradeSubscriptionDto {
    @ApiProperty()
    @IsUUID()
    plan_id!: string;
}
