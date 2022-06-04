import {IsString, IsNumber, IsOptional, IsEnum} from 'class-validator'
import {MaritalStatus} from 'src/enums/maritalStatus.enum'
import {Type} from 'class-transformer'
import {ApiProperty} from '@nestjs/swagger'


export class UpdateUserProfileDto {

    @ApiProperty({description: 'Must be an image file with one of jpg|png|jpeg extensions', required: false})
    @IsOptional()
    file?: string

    @ApiProperty({required: false})
    @IsString()
    @IsOptional()
    firstName: string

    @ApiProperty({required: false})
    @IsString()
    @IsOptional()
    lastName: string

    @ApiProperty({required: false})
    @IsNumber()
    @Type( () => Number )
    @IsOptional()
    age: number

    @ApiProperty({required: false})
    @IsEnum(MaritalStatus)
    @IsOptional()
    maritalStatus: MaritalStatus

    @ApiProperty({required: false})
    @IsString()
    @IsOptional()
    telephone: string

    @ApiProperty({required: false})
    @IsString()
    @IsOptional()
    address: string
    
}