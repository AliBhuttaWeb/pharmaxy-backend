import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ManufacturerDto {
    @ApiProperty()
    id!: string;

    @ApiProperty()
    name!: string;

    @ApiPropertyOptional()
    description!: string | null;

    @ApiProperty()
    created_at!: Date;

    @ApiProperty()
    updated_at!: Date;
}
