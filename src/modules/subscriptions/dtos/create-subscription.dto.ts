import { ApiProperty } from '@nestjs/swagger';

import { IsBoolean, IsOptional, IsUUID } from 'class-validator';

export class CreateSubscriptionDto {
    @ApiProperty()
    @IsUUID()
    pharmacy_id!: string;

    @ApiProperty()
    @IsUUID()
    plan_id!: string;

    @ApiProperty({
        required: false,
        default: true,
    })
    @IsOptional()
    @IsBoolean()
    auto_renew?: boolean;
}
