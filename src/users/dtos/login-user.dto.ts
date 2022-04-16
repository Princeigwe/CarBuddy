import {IsEmail, IsString} from 'class-validator'

export class LoginUserDto{
    @IsEmail() // email must be of email format
    email: string;

    @IsString()
    password: string;
}