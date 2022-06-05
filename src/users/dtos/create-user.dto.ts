import {IsEmail, IsString, IsNotEmpty, IsEnum} from 'class-validator'
import {Role} from 'src/enums/role.enum'
import {ApiProperty} from "@nestjs/swagger"

export class CreateUserDto{
    
    @ApiProperty({description: "The role of the user. ['User', 'Admin'] ", example: "User"})
    @IsNotEmpty()
    @IsEnum(Role)
    role: Role;
    
    @ApiProperty()
    @IsEmail() // email must be of email format
    email: string;

    @ApiProperty()
    @IsString()
    username: string;

    @ApiProperty()
    @IsString()
    password: string;

}