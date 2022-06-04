import { IsEnum, IsString, IsNumber, IsBoolean, IsOptional, IsNotEmpty} from "class-validator";
import {Type} from 'class-transformer'
import {CarStyle} from '../../enums/carStyle.enum'
import {UseType} from '../../enums/useType.enum'
import {DriveType} from '../../enums/driveType.enum'
import {FuelType} from '../../enums/fuelType.enum'
import {TransmissionType} from '../../enums/transmissionType.enum'
import {CarAvailability} from '../../enums/carAvailability.enum'


export class UpdateCarForSaleDto {

    // @Type( () => Number ) // fixed validation error in multipart/form-data format.

    @IsOptional()
    @IsEnum(CarStyle)
    style: CarStyle

    @IsOptional()
    @Type( () => Number )
    @IsNumber()
    releaseYear: number

    @IsOptional()
    @IsString()
    brand: string

    @IsOptional()
    @IsString()
    model: string

    @IsOptional()
    @IsEnum(UseType)
    useType: UseType

    @IsOptional()
    @Type( () => Number )
    @IsNumber()
    estimatedPrice: number

    @IsOptional()
    @IsEnum(CarAvailability)
    availability: CarAvailability

    @IsOptional()
    @Type( () => Number )

    @IsOptional()
    @IsNumber()
    mileage: number

    @IsOptional()
    @IsString()
    location: string

    @IsOptional()
    @IsString()
    exteriorColour: string

    @IsOptional()
    @IsString()
    interiorColour: string

    @IsOptional()
    @Type( () => Number )
    @IsNumber()
    milesPerGallon: number

    @IsOptional()
    @IsString()
    engine: string

    @IsOptional()
    @IsEnum(DriveType)
    driveType: DriveType

    @IsOptional()
    @IsEnum(FuelType)
    fuelType: FuelType

    @IsOptional()
    @IsEnum(TransmissionType)
    transmissionType: TransmissionType
}