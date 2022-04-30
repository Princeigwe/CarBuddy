import { Injectable, Response} from '@nestjs/common';
import {UserProfile} from '../../profiles/profiles.entity'
import {Car} from '../models/cars.entity'
import { InjectRepository } from '@nestjs/typeorm';
import {Repository} from 'typeorm'
// import {ExtraFeature} from '../models/extraFeature.entity'
import { CarStyle } from '../../enums/carStyle.enum';
import {UseType} from '../../enums/useType.enum'
import {DriveType} from '../../enums/driveType.enum'
import {FuelType} from '../../enums/fuelType.enum'
import {TransmissionType} from '../../enums/transmissionType.enum'
import {CarAvailability} from '../../enums/carAvailability.enum'
import {ExtraFeature} from '../models/extraFeature.entity'

// import {ExtraFeatureService} from './extra-feature.service'

@Injectable()
export class CarsService {

    constructor(
        @InjectRepository(Car) private carRepo: Repository<Car>,
        // private extraFeatureService: ExtraFeatureService

        // @InjectRepository(ExtraFeature) private extraFeatureRepo: Repository<ExtraFeature>
    ) {}

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

    async getAllCarsForSaleById(id: number) {
        const carModel =  await this.carRepo.findOne(id)
        return carModel
    }

    getAllCarsForSalePublic() {}

    editCarForSale() {}

    getCarsByBrand() {}

    async deleteCarForSale() {
        return await this.carRepo.clear()
    }
}
