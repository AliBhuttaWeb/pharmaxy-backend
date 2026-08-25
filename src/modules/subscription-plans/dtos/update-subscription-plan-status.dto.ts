import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdateSubscriptionPlanStatusDto {
    @ApiProperty()
    @IsBoolean()
    is_active!: boolean;
}
