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


    async addExtraFeature ( featureOne: string, featureTwo: string, featureThree: string, featureFour: string, carModelId: number, user: User ) {
        
        const ability = this.caslAbilityFactory.createForUser(user)
        
        const carModel = await this.carsService.getCarForSaleById(carModelId, user);

        // casl authentication: if the logged in user is the car dealer, or the admin, create the car feature
        if ( carModel.dealer == user || ability.can(Action.Manage, carModel) ) {
            const extraFeature = this.extraFeatureRepo.create({featureOne, featureTwo, featureThree, featureFour, carModel})
            return await this.extraFeatureRepo.save(extraFeature)
        }else {
            throw new HttpException('Forbidden Response', HttpStatus.FORBIDDEN)
        }
    }

    async getExtraFeatures() { 
        const extraFeatures = this.extraFeatureRepo.find()
        return extraFeatures
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
        this.extraFeatureRepo.clear()
        return new HttpException('Cars features Deleted', HttpStatus.GONE)
    }


}
