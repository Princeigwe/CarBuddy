import {IsEmail, IsString, IsNotEmpty, IsEnum} from 'class-validator'
import {Role} from 'src/enums/role.enum'

export class CreateUserDto{
    
    @IsNotEmpty()
    @IsEnum(Role)
    role: Role;
    
    @IsEmail() // email must be of email format
    email: string;

    @IsString()
    username: string;

    @IsString()
    password: string;

}