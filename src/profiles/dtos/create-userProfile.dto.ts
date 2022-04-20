import {IsString, IsNumber} from 'class-validator'

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

}