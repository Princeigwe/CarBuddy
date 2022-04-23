import {IsString, IsNumber, IsNotEmpty, IsEnum} from 'class-validator'
import {User} from '../../users/user.entity'
import {MaritalStatus} from 'src/enums/maritalStatus.enum'


export class CreateUserProfileDto {

    @IsString()
    firstName: string

    @IsString()
    lastName: string

    @IsNumber()
    age: number

    @IsNotEmpty()
    @IsEnum(MaritalStatus)
    maritalStatus: MaritalStatus

    @IsString()
    telephone: string

    @IsString()
    address: string

    // @IsNotEmpty()
    // user: User

}