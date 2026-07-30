import {
    ApiProperty,
    ApiPropertyOptional,
} from '@nestjs/swagger';

export class CategoryDto {
    @ApiProperty()
    id!: string;

    @ApiProperty()
    name!: string;

    @ApiPropertyOptional()
    description!: string | null;

    @ApiPropertyOptional()
    parent_id!: string | null;

    @ApiProperty()
    created_at!: Date;

    @ApiProperty()
    updated_at!: Date;
}