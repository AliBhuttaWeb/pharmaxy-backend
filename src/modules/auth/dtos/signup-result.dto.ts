import { ApiProperty } from "@nestjs/swagger";
import { AuthenticatedUser } from "../types";

export class SignupResultDto {
    @ApiProperty({ type: AuthenticatedUser })
    user!: AuthenticatedUser;
}