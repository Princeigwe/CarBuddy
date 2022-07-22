import {IsNotEmpty} from 'class-validator'
import {ApiProperty} from '@nestjs/swagger' // package to describe PATCH body parameters
export class ChangePasswordDto {

    @ApiProperty({required: true})
    @IsNotEmpty()
    password: string

    @ApiProperty({required: true})
    @IsNotEmpty()
    confirmPassword: string
}