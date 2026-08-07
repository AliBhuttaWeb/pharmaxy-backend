import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { SupplierStatus } from '@gen/prisma/client';

export class SupplierDto {
    @ApiProperty()
    id!: string;

    @ApiProperty()
    pharmacy_id!: string;

    @ApiProperty()
    name!: string;

    @ApiPropertyOptional()
    company_name!: string | null;

    @ApiPropertyOptional()
    registration_number!: string | null;

    @ApiPropertyOptional()
    tax_number!: string | null;

    @ApiPropertyOptional()
    contact_person!: string | null;

    @ApiPropertyOptional()
    phone!: string | null;

    @ApiPropertyOptional()
    email!: string | null;

    @ApiPropertyOptional()
    address!: string | null;

    @ApiPropertyOptional()
    city!: string | null;

    @ApiPropertyOptional()
    notes!: string | null;

    @ApiProperty({
        enum: SupplierStatus,
    })
    status!: SupplierStatus;

    @ApiProperty()
    created_at!: Date;

    @ApiProperty()
    updated_at!: Date;
}
