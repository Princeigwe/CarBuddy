import {IsString, IsNumber, IsNotEmpty} from 'class-validator'
import {User} from '../../users/user.entity'

export enum MaritalStatus {
    SINGLE = "single",
    MARRIED = "married",
    DIVORCED = "divorced"
}

export class CreateUserProfileDto {

    @IsString()
    firstName: string

    @IsString()
    lastName: string

    @IsNumber()
    age: number

    @IsString()
    maritalStatus: string

    @IsString()
    telephone: string

    @IsString()
    address: string

    // @IsNotEmpty()
    // user: User

}