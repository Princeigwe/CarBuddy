import {IsEmail, IsString, IsOptional, isEmail} from 'class-validator'

export class UpdateUserDto {

    @IsEmail()
    @IsOptional()
    email: string

    @IsString()
    @IsOptional()
    password: string

}