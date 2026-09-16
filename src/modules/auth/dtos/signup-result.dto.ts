import { ApiProperty } from '@nestjs/swagger';

export class SignupResultDto {
    @ApiProperty({
        example:
            'Account created successfully. An OTP has been sent to your email address. Please verify your account to continue.',
    })
    message!: string;
}
