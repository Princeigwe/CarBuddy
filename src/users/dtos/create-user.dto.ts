import {IsEmail, IsString} from 'class-validator'

export class CreateUserDto{
    @IsEmail() // email must be of email format
    email: string;

    @IsString()
    username: string;

    @IsString()
    password: string;
}