import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdateBranchStatusDto {
    @ApiProperty({
        description: 'Whether the branch is active.',
        example: true,
    })
    @IsBoolean()
    is_active!: boolean;
}
