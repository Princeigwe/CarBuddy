import { IsNotEmpty } from "class-validator";

export class ConfirmPasswordResetDto {

    @IsNotEmpty()
    password: string

    @IsNotEmpty()
    confirmPassword: string

    @IsNotEmpty()
    tokenString: string
}