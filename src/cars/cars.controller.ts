import { Controller,  Post, Patch, Get, Delete, Body, Request, UseInterceptors, UploadedFile, Header} from '@nestjs/common';
import { PutUpCarForSaleDto } from './dtos/putUpCarForSale.dto';
import {ExtraFeatureDto} from './dtos/extraFeatures.dto'
import {CarsService} from '../cars/services/cars.service'
import {ExtraFeatureService} from '../cars/services/extra-feature.service'
import { FileInterceptor } from '@nestjs/platform-express';
import {Express} from 'express';
@Controller('cars')
export class CarsController {

    constructor(
        private carsService: CarsService,
        // private extraFeatureService: ExtraFeatureService
        ) {}

    @Post()
    @UseInterceptors(FileInterceptor('image'))
    putUpCarForSale(
        @Body() carProfile: PutUpCarForSaleDto,
        // @UploadedFile() image: Express.Multer.File,
        // @Body() extraFeature: ExtraFeatureDto, 
        @Request() request) {
        // extraFeature = this.extraFeatureService.addFeatures(extraFeature)
        const user = request.user
        // const processedImage = ("\\x" + image.toString()) as any;
        return this.carsService.putUpCarForSale(
            carProfile.style,
            // processedImage,
            carProfile.releaseYear,
            carProfile.brand,
            carProfile.model,
            carProfile.useType,
            carProfile.estimatedPrice,
            carProfile.availability,
            carProfile.mileage, 
            carProfile.location,
            carProfile.exteriorColour,
            carProfile.interiorColour, 
            carProfile.milesPerGallon,
            carProfile.engine, 
            carProfile.driveType,
            carProfile.fuelType,
            carProfile.transmissionType,
            user,
            // extraFeature
        )
    }
}
