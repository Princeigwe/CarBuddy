import { Controller, Post, Get, Body, UseGuards, Request, Patch, Param, Delete } from '@nestjs/common';
import {ExtraFeatureService} from '../services/extra-feature.service'
import {ExtraFeatureDto} from '../dtos/extraFeatures.dto'
import { UpdateExtraFeatureDto } from '../dtos/updateExtraFeature.dto';
import {JwtAuthGuard} from '../../auth/jwt-auth.guard'
import {RolesGuard} from '../../roles.guards'
import { Roles } from 'src/roles.decorator';
import { Role } from 'src/enums/role.enum';
import {ApiTags, ApiOperation} from '@nestjs/swagger'

@Controller('extra-feature')
@ApiTags('Cars Extra Features')
export class ExtraFeatureController {
    constructor(private extraFeatureService: ExtraFeatureService) {}

    @ApiOperation({summary: "This action is only done by the admin user and car dealer"})
    @Post()
    @UseGuards(JwtAuthGuard)
    addExtraFeature (@Body() body: ExtraFeatureDto, @Request() request) {
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

    @ApiOperation({summary: "This action is only done by the admin user"})
    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    getExtraFeatures() {
        return this.extraFeatureService.getExtraFeatures()
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    getExtraFeatureById ( @Param('id') id: string, @Request() request) {
        const user = request.user
        return this.extraFeatureService.getExtraFeatureById( parseInt(id), user)
    }

    @ApiOperation({summary: "This action is only done by the admin user and car dealer"})
    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    updateExtraFeatureById( @Param('id') id: string, @Body() body: UpdateExtraFeatureDto, @Request() request) {
        const user = request.user
        return this.extraFeatureService.updateExtraFeatureById(parseInt(id), body, user)
    }

    @ApiOperation({summary: "This action is only done by the admin user"})
    @Delete()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    deleteFeatures () {
        return this.extraFeatureService.deleteFeatures()
    }

    @ApiOperation({summary: "This action is only done by the admin user and car dealer"})
    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    deleteExtraFeatureById ( @Param('id') id: string, @Request() request) {
        const user = request.user
        return this.extraFeatureService.deleteExtraFeatureById(parseInt(id), user)
    }
}
