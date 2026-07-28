import { ArrayNotEmpty, IsArray, IsUUID } from 'class-validator';

export class UpdateRolePermissionsDto {
    @IsArray()
    @ArrayNotEmpty()
    @IsUUID('4', { each: true })
    permission_ids!: string[];
}
