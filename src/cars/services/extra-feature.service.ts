import { Injectable, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import {Car} from '../models/cars.entity'
import {ExtraFeature} from '../models/extraFeature.entity'
import {Repository} from 'typeorm'
import {InjectRepository} from '@nestjs/typeorm'
import {CarsService} from './cars.service'
import {User} from '../../users/user.entity'
import {CaslAbilityFactory} from '../../casl/casl-ability.factory'
import {Action} from '../../enums/action.enum'


@Injectable()
export class ExtraFeatureService {
    constructor( 
        @InjectRepository(ExtraFeature) private extraFeatureRepo: Repository<ExtraFeature>,
        private carsService: CarsService,
        private caslAbilityFactory: CaslAbilityFactory
        ) {}

    // this method gets a car entity by its id, and adds its extra feature
    async addFeature(featureOne: string, featureTwo: string, featureThree: string, featureFour: string, carModelId: number, user: User) {
        const ability = this.caslAbilityFactory.createForUser(user)
        const carModel = await this.carsService.getCarForSaleById(carModelId, user)
        
        if (!carModel) {
            throw new BadRequestException(`Car with ${carModelId} does not exist`)
        }

        else{ 
            if(ability.can(Action.Create, carModel)) {
                const feature = this.extraFeatureRepo.create({featureOne, featureTwo, featureThree, featureFour, carModel})
                return this.extraFeatureRepo.save(feature)
            }
            else { 
                return new HttpException('Forbidden Response', HttpStatus.FORBIDDEN)
            }
        }
        
    }
}
