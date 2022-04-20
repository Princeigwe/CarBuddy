import {IsString, IsNumber, IsOptional} from 'class-validator'


export enum MaritalStatus {
    SINGLE = "single",
    MARRIED = "married",
    DIVORCED = "divorced"
}

export class UpdateUserProfileDto {

    @IsString()
    @IsOptional()
    firstName: string

    @IsString()
    @IsOptional()
    lastName: string

    @IsNumber()
    @IsOptional()
    age: number

    @IsString()
    @IsOptional()
    maritalStatus: string

    @IsString()
    @IsOptional()
    telephone: string

    @IsString()
    @IsOptional()
    address: string
    
}