import { ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsBoolean,
    IsEnum,
    IsInt,
    IsNumber,
    IsOptional,
    IsString,
    MaxLength,
    Min,
} from 'class-validator';
import { RadiusUnit } from '@gen/prisma/enums';

export class UpdateSettingsDto {
    // -----------------------------
    // General
    // -----------------------------
    @ApiPropertyOptional({ example: 'Asia/Karachi' })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    timezone?: string;

    @ApiPropertyOptional({ example: 'PKR' })
    @IsOptional()
    @IsString()
    @MaxLength(10)
    currency?: string;

    // -----------------------------
    // Receipt
    // -----------------------------
    @ApiPropertyOptional({ example: 'Welcome to our pharmacy' })
    @IsOptional()
    @IsString()
    receipt_header?: string;

    @ApiPropertyOptional({ example: 'Thank you for your visit' })
    @IsOptional()
    @IsString()
    receipt_footer?: string;

    @ApiPropertyOptional({ example: true })
    @IsOptional()
    @IsBoolean()
    print_logo?: boolean;

    @ApiPropertyOptional({ example: true })
    @IsOptional()
    @IsBoolean()
    print_tax_number?: boolean;

    @ApiPropertyOptional({ example: true })
    @IsOptional()
    @IsBoolean()
    print_phone?: boolean;

    @ApiPropertyOptional({ example: true })
    @IsOptional()
    @IsBoolean()
    print_address?: boolean;

    @ApiPropertyOptional({ example: false })
    @IsOptional()
    @IsBoolean()
    print_qr_code?: boolean;

    @ApiPropertyOptional({ example: true })
    @IsOptional()
    @IsBoolean()
    show_cashier_name?: boolean;

    // -----------------------------
    // Inventory
    // -----------------------------
    @ApiPropertyOptional({ example: 10 })
    @IsOptional()
    @IsInt()
    @Min(0)
    minimum_stock_quantity?: number;

    @ApiPropertyOptional({ example: 5 })
    @IsOptional()
    @IsInt()
    @Min(0)
    critical_stock_quantity?: number;

    @ApiPropertyOptional({ example: 30 })
    @IsOptional()
    @IsInt()
    @Min(0)
    expiry_alert_before_days?: number;

    // -----------------------------
    // Nearby Search
    // -----------------------------
    @ApiPropertyOptional({ example: false })
    @IsOptional()
    @IsBoolean()
    enable_stock_sharing?: boolean;

    @ApiPropertyOptional({ example: false })
    @IsOptional()
    @IsBoolean()
    share_inventory_details?: boolean;

    @ApiPropertyOptional({ example: false })
    @IsOptional()
    @IsBoolean()
    allow_reservations?: boolean;

    @ApiPropertyOptional({ example: 5.0 })
    @IsOptional()
    @IsNumber()
    @Min(0)
    search_radius?: number;

    @ApiPropertyOptional({ enum: RadiusUnit, example: RadiusUnit.KM })
    @IsOptional()
    @IsEnum(RadiusUnit)
    radius_unit?: RadiusUnit;

    // -----------------------------
    // Notifications
    // -----------------------------
    @ApiPropertyOptional({ example: true })
    @IsOptional()
    @IsBoolean()
    email_notifications?: boolean;

    @ApiPropertyOptional({ example: false })
    @IsOptional()
    @IsBoolean()
    sms_notifications?: boolean;

    @ApiPropertyOptional({ example: true })
    @IsOptional()
    @IsBoolean()
    push_notifications?: boolean;

    @ApiPropertyOptional({ example: true })
    @IsOptional()
    @IsBoolean()
    in_app_notifications?: boolean;

    @ApiPropertyOptional({ example: true })
    @IsOptional()
    @IsBoolean()
    low_stock_alert?: boolean;

    @ApiPropertyOptional({ example: true })
    @IsOptional()
    @IsBoolean()
    expiry_alert?: boolean;

    @ApiPropertyOptional({ example: true })
    @IsOptional()
    @IsBoolean()
    purchase_alert?: boolean;

    @ApiPropertyOptional({ example: false })
    @IsOptional()
    @IsBoolean()
    sale_alert?: boolean;
}
