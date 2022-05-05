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

    // this will be used by the admin user to get all extra features for cars that are both private and open to the public
    async getExtraFeatures () { 
        const extraFeatures = this.extraFeatureRepo.find()
        return extraFeatures
    }

    // writing a "getFeatures for public cars is not necessary"


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

    // TODO: remember to add casl authentication for adding feature to car
    // TODO: This is probably not working because the entity 'extraFeature' is linked to car entity which uses Authentication before it can be updated
    async updateExtraFeatureById (id: number, attrs: Partial<ExtraFeature>, user: User) { 
        const extraFeature = await this.extraFeatureRepo.findOne(id)
        if(!extraFeature) {
            throw new NotFoundException(`Car feature with id ${id} not found`)
        }
        else {
            if (user.role == Role.Admin) {
                Object.assign(extraFeature, attrs)
                return await this.extraFeatureRepo.save(extraFeature)
            }
            else {
                throw new HttpException('Forbidden Response', HttpStatus.FORBIDDEN)
            }
        }
    }

    // TODO: this method will be available to only Admin User
    deleteFeatures() {
        this.extraFeatureRepo.delete({})
        return new HttpException('Cars features Deleted', HttpStatus.GONE)
    }


}
