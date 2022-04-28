import { Injectable} from '@nestjs/common';
import {UserProfile} from '../../profiles/profiles.entity'
import {Car} from '../models/cars.entity'
import { InjectRepository } from '@nestjs/typeorm';
import {Repository} from 'typeorm'
import {ExtraFeature} from '../models/extraFeature.entity'
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
        // @InjectRepository(ExtraFeature) private extraFeatureRepo: Repository<ExtraFeature>
    ) {}

    async putUpCarForSale(
        image: string,
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
        // extraFeature: ExtraFeature
        ) {
            // const processedImage = ("\\x" + image.toString("hex")) as any;
            // extraFeature = this.extraFeatureRepo.create({featureOne})
            const carProfile = this.carRepo.create({
                image,
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
                // extraFeature
            })
            await this.carRepo.save(carProfile)
            return carProfile
        }

    editCarForSale() {}

    getAllCarsForSale() {}

    getAllCarsForSaleNotPublic() {}

    getCarsByBrand() {}

    deleteCarForSale() {}
}
