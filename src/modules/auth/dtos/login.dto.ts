import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class LoginDto {
    @ApiProperty({
        example: 'admin@pharmaxy.com',
        description: 'User email address',
    })
    @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
    @IsEmail()
    @IsNotEmpty()
    @MaxLength(255)
    email!: string;

    @ApiProperty({
        example: 'P@ssw0rd123',
        description: 'User password',
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    password!: string;
}
