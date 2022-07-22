import {IsString, IsNotEmpty} from 'class-validator'
import {ApiProperty} from '@nestjs/swagger' // package to describe PATCH body parameters

export class ForgotPasswordEmailDto {
    
    @ApiProperty({required: true})
    @IsNotEmpty()
    @IsString()
    email: string
}
