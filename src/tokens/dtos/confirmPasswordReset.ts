import { IsNotEmpty } from "class-validator";
import {ApiProperty} from '@nestjs/swagger' // package to describe PATCH body parameters

export class ConfirmPasswordResetDto {

    @ApiProperty({required: true})
    @IsNotEmpty()
    password: string

    @ApiProperty({required: true})
    @IsNotEmpty()
    confirmPassword: string

    @IsNotEmpty()
    tokenString: string
}