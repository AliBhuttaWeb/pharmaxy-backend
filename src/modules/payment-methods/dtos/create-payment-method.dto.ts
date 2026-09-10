import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentMethodType } from '@gen/prisma/client';
import {
    IsBoolean,
    IsEnum,
    IsInt,
    IsOptional,
    IsString,
    IsUUID,
    MaxLength,
    Min,
} from 'class-validator';

export class CreatePaymentMethodDto {
    @ApiProperty({ example: 'Cash' })
    @IsString()
    @MaxLength(100)
    name!: string;

    @ApiProperty({ example: 'CASH' })
    @IsString()
    @MaxLength(50)
    code!: string;

    @ApiProperty({ enum: PaymentMethodType, example: PaymentMethodType.CASH })
    @IsEnum(PaymentMethodType)
    type!: PaymentMethodType;

    @ApiPropertyOptional({ example: '8a70a94d-198e-4a72-a5aa-fe7111a28d86' })
    @IsOptional()
    @IsUUID()
    provider_id?: string;

    @ApiPropertyOptional({ example: 'Standard cash payment' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({ default: false })
    @IsOptional()
    @IsBoolean()
    requires_reference?: boolean;

    @ApiPropertyOptional({ default: true })
    @IsOptional()
    @IsBoolean()
    is_active?: boolean;

    @ApiPropertyOptional({ default: 0 })
    @IsOptional()
    @IsInt()
    @Min(0)
    display_order?: number;
}
