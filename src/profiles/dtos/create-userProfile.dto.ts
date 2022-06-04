import {IsString, IsNumber, IsNotEmpty, IsEnum, IsOptional} from 'class-validator'
import {MaritalStatus} from 'src/enums/maritalStatus.enum'
import {Type} from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'



export class CreateUserProfileDto {

    @ApiProperty({description: 'Must be an image file with one of jpg|png|jpeg extensions'})
    @IsOptional()
    file?: string

    @ApiProperty()
    @IsString()
    firstName: string

    @ApiProperty()
    @IsString()
    lastName: string

    @ApiProperty()
    @Type( () => Number )
    @IsNumber()
    age: number

    @ApiProperty({description: "An array of maritalStatus. ['single', 'married', 'divorced']", example: "single"})
    @IsNotEmpty()
    @IsEnum(MaritalStatus)
    maritalStatus: MaritalStatus

    @ApiProperty({description: "telephone of the user profile", example:"+23454545454"})
    @IsString()
    telephone: string

    @ApiProperty()
    @IsString()
    address: string

}