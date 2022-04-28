import { Injectable } from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm'
import {Repository} from 'typeorm'
import {ExtraFeature} from '../models/extraFeature.entity'

@Injectable()
export class ExtraFeatureService {
    constructor(@InjectRepository(ExtraFeature) private extraFeatureRepo: Repository<ExtraFeature>) {}

    async addFeatures(
        featureOne: string,
        featureTwo: string,
        featureThree: string,
        featureFour: string,
        featureFive: string,
        featureSix: string,
    ) {
        const features = this.extraFeatureRepo.create({featureOne, featureTwo, featureThree, featureFour, featureFive, featureSix})
        await this.extraFeatureRepo.save(features)
        return features
    }
}
