import { Injectable, Response, HttpException, HttpStatus} from '@nestjs/common';
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
import {User} from '../../users/user.entity'
import {CaslAbilityFactory} from '../../casl/casl-ability.factory'
import {Action} from '../../enums/action.enum'


@Injectable()
export class CarsService {

    constructor(
        @InjectRepository(Car) private carRepo: Repository<Car>,
        private caslAbilityFactory: CaslAbilityFactory
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
        dealer: User,
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

    /**
     * 
     * TODO: if the car that is to be requested is available to the public, it should be accessed by anyone,
     * TODO: else only the Admin User, and the user who put if up can access it.
     */
    async getCarForSaleById(id: number, dealer: User) {
        const ability = this.caslAbilityFactory.createForUser(dealer)
        const carModel =  await this.carRepo.findOne(id)
        if (carModel.availability == CarAvailability.PUBLIC){
            return carModel
        }
        else{
            /*
                normally, it should have Action.Read permission, but this gives read access to other users, when the car is not available to the public.
                if the code is written as "if(carModel.dealer == user){return carModel}", the Admin User won't have access to it either.
            */
            if (ability.can(Action.Create, carModel)) {
                return carModel
            }
            else {
                throw new HttpException('Forbidden Response', HttpStatus.FORBIDDEN)
            }
        }
    }

    // getting all cars that are available to the public
    async getAllPublicCarsForSale() {
        const publicCars = await this.carRepo.find({ where: { availability: CarAvailability.PUBLIC }})
        return publicCars
    }

    editCarForSale() {}

    async queryPublicCarsByBrandOrAndEstimatedPriceOrAndDriveTypeOrAndUseType(brand?: string, estPrice?: number, driveType?: string, useType?: string) {
        // tried to write this with switch-case, didn't work properly.
        if(estPrice && useType) { return await this.carRepo.find({ where: {estimatedPrice: estPrice, useType: useType, availability: CarAvailability.PUBLIC}}) }
        else if(brand) { return await this.carRepo.find({ where: { brand: brand, availability: CarAvailability.PUBLIC}}) }
        else if(estPrice) { return await this.carRepo.find({ where: {estimatedPrice: estPrice, availability: CarAvailability.PUBLIC} }) }
        else if(driveType) { return await this.carRepo.find({ where: {driveType: driveType, availability: CarAvailability.PUBLIC}}) }
        else if(useType ) { return await this.carRepo.find({ where: {useType: useType, availability: CarAvailability.PUBLIC}}) }
    }

    // drop the table
    async deleteCarForSale() {
        return await this.carRepo.clear()
    }

    async deleteCarForSaleById() {

    }
}
