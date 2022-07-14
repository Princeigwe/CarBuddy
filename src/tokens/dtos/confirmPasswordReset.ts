import { IsNotEmpty } from "class-validator";

export class ConfirmPasswordResetDto {

    @IsNotEmpty()
    token: any;
}