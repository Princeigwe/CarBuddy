import { Injectable, Response, HttpException, HttpStatus, NotFoundException} from '@nestjs/common';
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
    /**
     * This function takes in a file, a car style, a release year, a brand, a model, a use type, an
     * estimated price, an availability, a mileage, a location, an exterior colour, an interior colour,
     * a miles per gallon, an engine, a drive type, a fuel type, a transmission type, and a dealer, and
     * then it creates a car profile with all of those attributes, and then it saves that car profile
     * to the database, and then it returns that car profile
     * @param {string} file - string,
     * @param {CarStyle} style - CarStyle,
     * @param {number} releaseYear - number,
     * @param {string} brand - string,
     * @param {string} model - CarProfile
     * @param {UseType} useType - UseType,
     * @param {number} estimatedPrice - number,
     * @param {CarAvailability} availability - CarAvailability,
     * @param {number} mileage - number,
     * @param {string} location - string,
     * @param {string} exteriorColour - string,
     * @param {string} interiorColour - string,
     * @param {number} milesPerGallon - number,
     * @param {string} engine - string,
     * @param {DriveType} driveType - DriveType,
     * @param {FuelType} fuelType - FuelType,
     * @param {TransmissionType} transmissionType - TransmissionType,
     * @param {User} dealer - User
     * @returns The carProfile is being returned.
     */
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

    /**
     * It returns a promise that resolves to an array of cars
     * @returns An array of all the cars for sale
     */
    async getAllCarsForSale() {
        return await this.carRepo.find()
    }

    /**
     * 
     * TODO: if the car that is to be requested is available to the public, it should be accessed by anyone,
     * TODO: else only the Admin User, and the user who put if up can access it.
     */
    /**
     * If the car is available to the public, return the car. If the car is not available to the
     * public, return the car only if the user is the dealer or the user has the ability to manage the
     * car
     * @param {number} id - number - the id of the car to be retrieved
     * @param {User} dealer - User - the user who is trying to access the car
     * @returns The carModel is being returned.
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
            if ( JSON.stringify(carModel.dealer) === JSON.stringify(dealer) || ability.can(Action.Manage, carModel)) {
                return carModel
            }
            else {
                throw new HttpException('Forbidden Response', HttpStatus.FORBIDDEN)
            }
        }
    }

    // this is to be used in the cart service
    /**
    * If the car is public, return the car. If not, throw an error
    * @param {number} id - number - The id of the car we want to find
    * @returns The carModel is being returned.
    */
    async getPublicCarByIdForCart(id: number) {
        const carModel = await this.carRepo.findOne(id)
        if (carModel.availability == CarAvailability.PUBLIC) {
            return carModel
        }
        else {
            throw new NotFoundException('Car Not Found')
        }
    }

    // getting all cars that are available to the public
    /**
     * > This function returns all the cars that are available for sale
     * @returns An array of cars that are available for sale.
     */
    async getAllPublicCarsForSale() {
        const publicCars = await this.carRepo.find({ where: { availability: CarAvailability.PUBLIC }})
        return publicCars
    }

    /**
     * The function takes in a car id, a partial car object, and a user object. It then checks if the
     * user has the ability to update the car, and if so, it updates the car
     * @param {number} id - number - the id of the car to be edited
     * @param attrs - Partial<Car>
     * @param {User} dealer - User - the user who is making the request
     * @returns The updated car model
     */
    async editCarForSale(id: number, attrs: Partial<Car>, dealer: User) {
        const carModel = await this.carRepo.findOne(id)
        const ability = this.caslAbilityFactory.createForUser(dealer)
        if (!carModel) {
            throw new NotFoundException(`Car Profile with id: ${id} does not exist`)
        }
        else{
            if(ability.can(Action.Update, carModel) || JSON.stringify(carModel.dealer) === JSON.stringify(dealer)  ){
                Object.assign(carModel, attrs) // make the update
                return this.carRepo.save(carModel)
            }
            else{ throw new HttpException('Forbidden Response', HttpStatus.FORBIDDEN) }
        }
    }

    async updateCarImageById (id: number,  file ?:any) {
        const carModel = await this.carRepo.findOne(id)
        // const ability = this.caslAbilityFactory.createForUser(dealer)
        carModel.file = file
        return this.carRepo.save(carModel)
    }

    /**
     * It returns a list of cars that are public and match the given parameters
     * @param {string} [brand] - string
     * @param {number} [estPrice] - number
     * @param {string} [driveType] - string - can be 'front', 'rear', 'four'
     * @param {string} [useType] - CarUseType
     * @returns An array of cars.
     */
    async queryPublicCarsByBrandOrAndEstimatedPriceOrAndDriveTypeOrAndUseType(brand?: string, estPrice?: number, driveType?: string, useType?: string) {
        // tried to write this with switch-case, didn't work properly.
        if(estPrice && useType) { return await this.carRepo.find({ where: {estimatedPrice: estPrice, useType: useType, availability: CarAvailability.PUBLIC}}) }
        else if(brand) { return await this.carRepo.find({ where: { brand: brand, availability: CarAvailability.PUBLIC}}) }
        else if(estPrice) { return await this.carRepo.find({ where: {estimatedPrice: estPrice, availability: CarAvailability.PUBLIC} }) }
        else if(driveType) { return await this.carRepo.find({ where: {driveType: driveType, availability: CarAvailability.PUBLIC}}) }
        else if(useType ) { return await this.carRepo.find({ where: {useType: useType, availability: CarAvailability.PUBLIC}}) }
    }

    // drop the table
    async deleteAllCarsForSale() {
        return await this.carRepo.delete({}) // .clear() does not truncate table when there's a foreign key constraint [typeORM issue]
    }

    /**
     * The function checks if the user has the ability to delete the car profile, if the user has the
     * ability to delete the car profile, the car profile is deleted, if the user does not have the
     * ability to delete the car profile, the user is forbidden from deleting the car profile
     * @param {number} id - number - The id of the car you want to delete
     * @param {User} dealer - User - the user who is trying to delete the car
     * @returns The car profile is being deleted.
     */
    async deleteCarForSaleById(id: number, dealer: User) {
        const carModel = await this.getCarForSaleById(id, dealer)
        const ability =  this.caslAbilityFactory.createForUser(dealer)

        if (ability.can(Action.Delete, carModel) || JSON.stringify(carModel.dealer) === JSON.stringify(dealer) ){
            this.carRepo.remove(carModel)
            return new HttpException('Car Profile Deleted', HttpStatus.GONE)
        }
        else{
            throw new HttpException('Forbidden Response', HttpStatus.FORBIDDEN)
        }
    }
}
