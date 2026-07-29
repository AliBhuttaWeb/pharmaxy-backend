import { ApiProperty } from '@nestjs/swagger';

export class PermissionDto {
    @ApiProperty()
    id!: string;

    @ApiProperty()
    name!: string;

    @ApiProperty({
        nullable: true,
    })
    description!: string | null;

    @ApiProperty()
    group!: string;

    @ApiProperty()
    created_at!: Date;

    @ApiProperty()
    updated_at!: Date;
}
