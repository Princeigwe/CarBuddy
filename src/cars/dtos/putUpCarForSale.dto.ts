import { IsEnum, IsString, IsNumber, IsBoolean, IsOptional, IsNotEmpty} from "class-validator";
import {Type} from 'class-transformer'
import {CarStyle} from '../../enums/carStyle.enum'
import {UseType} from '../../enums/useType.enum'
import {DriveType} from '../../enums/driveType.enum'
import {FuelType} from '../../enums/fuelType.enum'
import {TransmissionType} from '../../enums/transmissionType.enum'
import {CarAvailability} from '../../enums/carAvailability.enum'

export class PutUpCarForSaleDto {

    // @Type( () => Number ) // fixed validation error in multipart/form-data format.

    @IsEnum(CarStyle)
    style: CarStyle

    // image: string

    @Type( () => Number )
    @IsNumber()
    releaseYear: number

    @IsString()
    brand: string

    @IsString()
    model: string

    @IsEnum(UseType)
    useType: UseType

    @Type( () => Number )
    @IsNumber()
    estimatedPrice: number

    @IsEnum(CarAvailability)
    availability: CarAvailability

    @Type( () => Number )
    @IsNumber()
    mileage: number

    @IsString()
    location: string

    @IsString()
    exteriorColour: string

    @IsString()
    interiorColour: string

    @Type( () => Number )
    @IsNumber()
    milesPerGallon: number

    @IsString()
    engine: string

    @IsEnum(DriveType)
    driveType: DriveType

    @IsEnum(FuelType)
    fuelType: FuelType

    @IsEnum(TransmissionType)
    transmissionType: TransmissionType
}