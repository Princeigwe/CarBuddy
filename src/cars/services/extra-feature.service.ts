import { Injectable, BadRequestException } from '@nestjs/common';
import {Car} from '../models/cars.entity'
import {ExtraFeature} from '../models/extraFeature.entity'
import {Repository} from 'typeorm'
import {InjectRepository} from '@nestjs/typeorm'
import {CarsService} from './cars.service'

@Injectable()
export class ExtraFeatureService {
    constructor( 
        @InjectRepository(ExtraFeature) private extraFeatureRepo: Repository<ExtraFeature>,
        private carsService: CarsService
        ) {}

    // this method gets a car entity by its id, and adds its extra feature
    async addFeature(featureOne: string, featureTwo: string, featureThree: string, featureFour: string, carModelId: number) {
        const carModel = await this.carsService.getCarForSaleById(carModelId)
        if (!carModel) {throw new BadRequestException(`Car with ${carModelId} does not exist`)}
        const feature = this.extraFeatureRepo.create({featureOne, featureTwo, featureThree, featureFour, carModel})
        return this.extraFeatureRepo.save(feature)
    }
}
