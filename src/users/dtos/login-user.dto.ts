import {IsEmail, IsString} from 'class-validator'
import {ApiProperty} from '@nestjs/swagger'

export class LoginUserDto{
    @ApiProperty()
    @IsEmail() // email must be of email format
    email: string;

    @ApiProperty()
    @IsString()
    password: string;
}