import { Injectable, Response} from '@nestjs/common';
import {UserProfile} from '../../profiles/profiles.entity'
import {Car} from '../models/cars.entity'
import { InjectRepository } from '@nestjs/typeorm';
import {Repository, Any} from 'typeorm'
import { CarStyle } from '../../enums/carStyle.enum';
import {UseType} from '../../enums/useType.enum'
import {DriveType} from '../../enums/driveType.enum'
import {FuelType} from '../../enums/fuelType.enum'
import {TransmissionType} from '../../enums/transmissionType.enum'
import {CarAvailability} from '../../enums/carAvailability.enum'



@Injectable()
export class CarsService {

    constructor(
        @InjectRepository(Car) private carRepo: Repository<Car>,
    ) {}

    // this method is to POST a car for sale
    async putUpCarForSale(
        file: string,
        style: CarStyle, 
        releaseYear: number, 
        brand: string, 
        model: string, 
        useType: UseType, 
        estimatedPrice: number, 
        availability: CarAvailability, 
        mileage: number, 
        location: string, 
        exteriorColour: string, 
        interiorColour: string, 
        milesPerGallon: number, 
        engine: string, 
        driveType: DriveType, 
        fuelType: FuelType, 
        transmissionType: TransmissionType, 
        dealer: UserProfile,
        ) {
            // JSON.parse(file.toString())
            const carProfile = this.carRepo.create({
                file,
                style,  
                releaseYear, 
                brand, 
                model, 
                useType, 
                estimatedPrice, 
                availability, 
                mileage, 
                location, 
                exteriorColour, 
                interiorColour, 
                milesPerGallon,
                engine,
                driveType,
                fuelType, 
                transmissionType,
                dealer,
            })
            await this.carRepo.save(carProfile)
            return carProfile
        }

    async getAllCarsForSale() {
        return await this.carRepo.find()
        
    }

    async getCarForSaleById(id: number) {
        const carModel =  await this.carRepo.findOne(id)
        return carModel
    }

    // getting all cars that are available to the public
    async getAllPublicCarsForSale() {
        const publicCars = await this.carRepo.find({ where: { availability: CarAvailability.PUBLIC }})
        return publicCars
    }

    editCarForSale() {}

    async queryCarsByBrandOrAndEstimatedPriceOrAndDriveTypeOrAndUseType(brand?: string, estPrice?: number, driveType?: string, useType?: string) {
        // tried to write this with switch-case, didn't work properly.
        if(estPrice && useType) { return await this.carRepo.find({ where: {estimatedPrice: estPrice, useType: useType}}) }
        else if(brand) { return await this.carRepo.find({ where: { brand: brand}}) }
        else if(estPrice) { return await this.carRepo.find({ where: {estimatedPrice: estPrice} }) }
        else if( driveType ) { return await this.carRepo.find({ where: {driveType: driveType}}) }
        else if(useType ) { return await this.carRepo.find({ where: {useType: useType}}) }
    }

    // drop the table
    async deleteCarForSale() {
        return await this.carRepo.clear()
    }

    async deleteCarForSaleById() {

    }
}
