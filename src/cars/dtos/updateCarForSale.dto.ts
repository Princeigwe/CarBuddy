import { IsEnum, IsString, IsNumber, IsBoolean, IsOptional, IsNotEmpty} from "class-validator";
import {Type} from 'class-transformer'
import {CarStyle} from '../../enums/carStyle.enum'
import {UseType} from '../../enums/useType.enum'
import {DriveType} from '../../enums/driveType.enum'
import {FuelType} from '../../enums/fuelType.enum'
import {TransmissionType} from '../../enums/transmissionType.enum'
import {CarAvailability} from '../../enums/carAvailability.enum'
import {ApiProperty} from '@nestjs/swagger'


export class UpdateCarForSaleDto {

    // @Type( () => Number ) // fixed validation error in multipart/form-data format.

    @ApiProperty({description: 'Must be an image file with one of jpg|png|jpeg extensions', required: false})
    @IsOptional()
    file?: string

    @ApiProperty({required: false})
    @IsOptional()
    @IsEnum(CarStyle)
    style: CarStyle

    @ApiProperty({required: false})
    @IsOptional()
    @Type( () => Number )
    @IsNumber()
    releaseYear: number

    @ApiProperty({required: false})
    @IsOptional()
    @IsString()
    brand: string

    @ApiProperty({required: false})
    @IsOptional()
    @IsString()
    model: string

    @ApiProperty({required: false})
    @IsOptional()
    @IsEnum(UseType)
    useType: UseType

    @ApiProperty({required: false})
    @IsOptional()
    @Type( () => Number )
    @IsNumber()
    estimatedPrice: number

    @ApiProperty({required: false})
    @IsOptional()
    @IsEnum(CarAvailability)
    availability: CarAvailability

    @ApiProperty({required: false})
    @IsOptional()
    @Type( () => Number )

    @ApiProperty({required: false})
    @IsOptional()
    @IsNumber()
    mileage: number

    @ApiProperty({required: false})
    @IsOptional()
    @IsString()
    location: string

    @ApiProperty({required: false})
    @IsOptional()
    @IsString()
    exteriorColour: string

    @ApiProperty({required: false})
    @IsOptional()
    @IsString()
    interiorColour: string

    @ApiProperty({required: false})
    @IsOptional()
    @Type( () => Number )
    @IsNumber()
    milesPerGallon: number

    @ApiProperty({required: false})
    @IsOptional()
    @IsString()
    engine: string

    @ApiProperty({required: false})
    @IsOptional()
    @IsEnum(DriveType)
    driveType: DriveType

    @ApiProperty({required: false})
    @IsOptional()
    @IsEnum(FuelType)
    fuelType: FuelType

    @ApiProperty({required: false})
    @IsOptional()
    @IsEnum(TransmissionType)
    transmissionType: TransmissionType
}