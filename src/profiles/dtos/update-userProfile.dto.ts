import {IsString, IsNumber, IsOptional, IsEnum} from 'class-validator'
import {MaritalStatus} from 'src/enums/maritalStatus.enum'
import {Type} from 'class-transformer'


export class UpdateUserProfileDto {

    @IsString()
    @IsOptional()
    firstName: string

    @IsString()
    @IsOptional()
    lastName: string

    @IsNumber()
    @Type( () => Number )
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