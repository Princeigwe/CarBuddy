import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import {ExtraFeatureService} from '../services/extra-feature.service'
import {ExtraFeatureDto} from '../dtos/extraFeatures.dto'
import {JwtAuthGuard} from '../../auth/jwt-auth.guard'

@Controller('extra-feature')
export class ExtraFeatureController {
    constructor(private extraFeatureService: ExtraFeatureService) {}

    @Post()
    @UseGuards(JwtAuthGuard)
    async addFeature ( @Body() body: ExtraFeatureDto, @Request() request ) {
        const user = request.user
        const extraFeature = await this.extraFeatureService.addFeature(
            body.featureOne, body.featureTwo, body.featureThree, body.featureFour, body.carModelId, user
        )
        console.log(extraFeature)
        return extraFeature
    }


}
