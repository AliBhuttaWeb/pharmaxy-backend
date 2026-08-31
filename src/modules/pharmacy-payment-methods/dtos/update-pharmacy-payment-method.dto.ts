import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, Min } from 'class-validator';

export class UpdatePharmacyPaymentMethodDto {
    @ApiPropertyOptional({
        example: 1,
        minimum: 0,
    })
    @IsOptional()
    @IsInt()
    @Min(0)
    display_order?: number;
}
