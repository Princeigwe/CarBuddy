import { Injectable, BadRequestException, HttpException, NotFoundException, HttpStatus } from '@nestjs/common';
import {Car} from '../models/cars.entity'
import {ExtraFeature} from '../models/extraFeature.entity'
import {Repository} from 'typeorm'
import {InjectRepository} from '@nestjs/typeorm'
import {CarsService} from './cars.service'
import {User} from '../../users/user.entity'
import {CaslAbilityFactory} from '../../casl/casl-ability.factory'
import {Action} from '../../enums/action.enum'
import {CarAvailability} from '../../enums/carAvailability.enum'
import { Role } from 'src/enums/role.enum';


@Injectable()
export class ExtraFeatureService {
    constructor( 
        @InjectRepository(ExtraFeature) private extraFeatureRepo: Repository<ExtraFeature>,
        private carsService: CarsService,
        private caslAbilityFactory: CaslAbilityFactory
        ) {}

    // a car feature can only be added here if the logged in user is the car dealer, or the Admin user. 
    async addExtraFeature ( featureOne: string, featureTwo: string, featureThree: string, featureFour: string, carModelId: number, user: User ) {
        
        const ability = this.caslAbilityFactory.createForUser(user)
        
        const carModel = await this.carsService.getCarForSaleById(carModelId, user);

        console.log(carModel.dealer);

        // casl authentication: if the logged in user is the car dealer, or the admin, create the car feature
        if ( JSON.stringify(carModel.dealer) === JSON.stringify(user) || ability.can(Action.Manage, carModel) ) {
            const extraFeature = this.extraFeatureRepo.create({featureOne, featureTwo, featureThree, featureFour, carModel})
            return await this.extraFeatureRepo.save(extraFeature)
        }else {
            throw new HttpException('Forbidden Response', HttpStatus.FORBIDDEN)
        }
    }

    // this will be used by the admin user 
    async getExtraFeatures () { 
        const extraFeatures = this.extraFeatureRepo.find()
        return extraFeatures
    }



    // writing a "getFeatures for public cars" is not necessary since it can be viewed from car Profile


    /**
     * If the car model is public, return the extra feature. If the car model is private, check if the
     * user is the dealer or has the ability to manage the car model. If so, return the extra feature.
     * If not, throw a forbidden response
     * @param {number} id - the id of the extra feature
     * @param {User} user - User - the user that is currently logged in
     * @returns The extra feature with the given id.
     */
    async getExtraFeatureById (id: number, user: User) {
        const ability = this.caslAbilityFactory.createForUser(user)
        const extraFeature = await this.extraFeatureRepo.findOne({ where: { id: id}, relations: ['carModel'] })
        const carModel = extraFeature.carModel

        console.log(extraFeature)
        console.log(carModel)

        if (carModel['availability'] == CarAvailability.PUBLIC) {
            return extraFeature
        }
        else{
            
            if(JSON.stringify(carModel.dealer) === JSON.stringify(user) || ability.can(Action.Manage, carModel)) {
                return extraFeature
            }
            else{ 
                throw new HttpException('Forbidden Response', HttpStatus.FORBIDDEN)
            }
        }
    }


    /**
     * It updates an extra feature by id, if the user is the dealer of the car model of the extra
     * feature or if the user has the ability to manage the car model of the extra feature
     * @param {number} id - number - the id of the extra feature to be updated
     * @param attrs - Partial<ExtraFeature>
     * @param {User} user - User - the user object that is passed in from the controller
     * @returns The updated extra feature
     */
    async updateExtraFeatureById (id: number, attrs: Partial<ExtraFeature>, user: User) { 
        const ability = this.caslAbilityFactory.createForUser(user)
        const extraFeature = await this.extraFeatureRepo.findOne({ where: { id: id}, relations: ['carModel'] })
        const carModel = extraFeature.carModel

        console.log(carModel.dealer)
        
        if(!extraFeature) {
            throw new NotFoundException(`Car feature with id ${id} not found`)
        }
        else {
            if (JSON.stringify(carModel.dealer) === JSON.stringify(user) || ability.can(Action.Manage, carModel)) {
                Object.assign(extraFeature, attrs)
                return await this.extraFeatureRepo.save(extraFeature)
            }
            else {
                throw new HttpException('Forbidden Response', HttpStatus.FORBIDDEN)
            }
        }
    }

    // this method will be available to only Admin User
    deleteFeatures() {
        this.extraFeatureRepo.delete({})
        return new HttpException('Cars features Deleted', HttpStatus.GONE)
    }

    /**
     * It deletes a car feature by id, but only if the user is the dealer of the car model that the
     * feature belongs to, or if the user has the ability to manage the car model
     * @param {number} id - The id of the extra feature to be deleted
     * @param {User} user - User - the user object that is passed in from the controller
     * @returns return new HttpException('Car feature Deleted', HttpStatus.GONE)
     */
    async deleteExtraFeatureById(id:number, user: User) {
        const ability = this.caslAbilityFactory.createForUser(user)
        const extraFeature = await this.extraFeatureRepo.findOne({ where: { id: id}, relations: ['carModel'] })
        const carModel = extraFeature.carModel

        console.log(carModel.dealer)

        if(!extraFeature) {
            throw new NotFoundException(`Car feature with id ${id} not found`)
        }
        else {

            if (JSON.stringify(carModel.dealer) === JSON.stringify(user) || ability.can(Action.Manage, carModel)) {
                this.extraFeatureRepo.delete(extraFeature)
                return new HttpException('Car feature Deleted', HttpStatus.GONE)
            }
            else{
                throw new HttpException('Forbidden Response', HttpStatus.FORBIDDEN)
            }
        }
    }
}
