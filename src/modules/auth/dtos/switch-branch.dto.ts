import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class SwitchBranchDto {
    @ApiProperty({
        example: '3f2a6b3c-8d91-4d2a-9f01-123456789abc',
    })
    @IsUUID()
    branchId!: string;
}
