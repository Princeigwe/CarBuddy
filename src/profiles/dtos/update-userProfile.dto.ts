import {IsString, IsNumber, IsOptional, IsEnum} from 'class-validator'
import {MaritalStatus} from 'src/enums/maritalStatus.enum'

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

    @IsEnum(MaritalStatus)
    @IsOptional()
    maritalStatus: MaritalStatus

    @IsString()
    @IsOptional()
    telephone: string

    @IsString()
    @IsOptional()
    address: string
    
}