import { Controller, Post, Get, Body, UseGuards, Request, Patch, Param, Delete } from '@nestjs/common';
import {ExtraFeatureService} from '../services/extra-feature.service'
import {ExtraFeatureDto} from '../dtos/extraFeatures.dto'
import { UpdateExtraFeatureDto } from '../dtos/updateExtraFeature.dto';
import {JwtAuthGuard} from '../../auth/jwt-auth.guard'
import {RolesGuard} from '../../roles.guards'
import { Roles } from 'src/roles.decorator';
import { Role } from 'src/enums/role.enum';

@Controller('extra-feature')
export class ExtraFeatureController {
    constructor(private extraFeatureService: ExtraFeatureService) {}

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    addExtraFeature (@Body() body: ExtraFeatureDto,@Request() request) {
        const user = request.user;
        return this.extraFeatureService.addExtraFeature(
            body.featureOne,
            body.featureTwo,
            body.featureThree,
            body.featureFour,
            body.carModelId,
            user
        )
    }

    @Get()
    getExtraFeatures() {
        return this.extraFeatureService.getExtraFeatures()
    } 

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    @Roles(Role.Admin)
    updateExtraFeatureById( @Param('id') id: string, @Body() body: UpdateExtraFeatureDto, @Request() request) {
        const user = request.user
        return this.extraFeatureService.updateExtraFeatureById(parseInt(id), body, user)
    }

    @Delete()
    deleteFeatures () {
        return this.extraFeatureService.deleteFeatures()
    }

}
