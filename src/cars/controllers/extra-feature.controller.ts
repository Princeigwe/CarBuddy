import { Controller, Post, Get, Body  } from '@nestjs/common';
import {ExtraFeatureService} from '../services/extra-feature.service'
import {ExtraFeatureDto} from '../dtos/extraFeatures.dto'

@Controller('extra-feature')
export class ExtraFeatureController {
    constructor(private extraFeatureService: ExtraFeatureService) {}

    @Post()
    async addFeature ( @Body() body: ExtraFeatureDto ) {
        const extraFeature = await this.extraFeatureService.addFeature(
            body.featureOne, body.featureTwo, body.featureThree, body.featureFour, body.carModelId)
        console.log(extraFeature)
        return extraFeature
    }


}
