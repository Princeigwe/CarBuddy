import { IsEnum, IsString, IsNumber, IsBoolean, IsOptional, IsNotEmpty} from "class-validator";
import {Type} from 'class-transformer'
import {CarStyle} from '../../enums/carStyle.enum'
import {UseType} from '../../enums/useType.enum'
import {DriveType} from '../../enums/driveType.enum'
import {FuelType} from '../../enums/fuelType.enum'
import {TransmissionType} from '../../enums/transmissionType.enum'
import {CarAvailability} from '../../enums/carAvailability.enum'
import {ApiProperty} from '@nestjs/swagger' // package to describe POST body

export class PutUpCarForSaleDto {

    // @Type( () => Number ) // fixed validation error in multipart/form-data format.

    // this is to make up for car file documentation
    @ApiProperty({description: 'Must be an image file with one of jpg|png|jpeg extensions'})
    @IsOptional()
    file?: string

    @ApiProperty({
        description: "This is an array of car styles to choose from. [ 'Truck', 'SUV', 'Sedan', 'Hatchback', 'Coupe', 'Convertible', 'Van' ]",
        example: "Sedan"
    })
    @IsEnum(CarStyle)
    style: CarStyle

    @ApiProperty({example: "2017"})
    @Type( () => Number )
    @IsNumber()
    releaseYear: number

    @ApiProperty({example: "Toyota"})
    @IsString()
    brand: string

    @ApiProperty()
    @IsString()
    model: string

    @ApiProperty({description: "An array of use types. [ 'New', 'Fairly-Used' ] ", example: "New"})
    @IsEnum(UseType)
    useType: UseType

    @ApiProperty()
    @Type( () => Number )
    @IsNumber()
    estimatedPrice: number

    @ApiProperty({description: "An array of car availability to choose from. ['Private', 'Public' ] ", example: "Private"})
    @IsEnum(CarAvailability)
    availability: CarAvailability

    @ApiProperty()
    @Type( () => Number )
    @IsNumber()
    mileage: number

    @ApiProperty()
    @IsString()
    location: string

    @ApiProperty()
    @IsString()
    exteriorColour: string

    @ApiProperty()
    @IsString()
    interiorColour: string

    @ApiProperty()
    @Type( () => Number )
    @IsNumber()
    milesPerGallon: number

    @ApiProperty()
    @IsString()
    engine: string

    @ApiProperty({
        description: "An array of drive types to choose from. ['Front-Wheel-Drive', 'Rear-Wheel-Drive', 'Four-Wheel-Drive', 'All-Wheel-Drive'] ",
        example: "Rear-Wheel-Drive"
    })
    @IsEnum(DriveType)
    driveType: DriveType

    @ApiProperty({ 
        description: "An array of fuel types to choose from. ['Gasoline', 'Diesel-Fuel', 'Bio-Diesel', 'Ethanol', 'Electric-Batteries']", 
        example: "Electric-Batteries"
    })
    @IsEnum(FuelType)
    fuelType: FuelType

    @ApiProperty({
        description: "An array of transmission types to choose from. [ 'Manual', 'Automatic' ]",
        example: "Manual"
    })
    @IsEnum(TransmissionType)
    transmissionType: TransmissionType
}