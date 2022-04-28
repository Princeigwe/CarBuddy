import { Controller,  Post, Patch, Get, Delete, Body, Request, UseInterceptors, UploadedFile, Header, BadRequestException} from '@nestjs/common';
import { PutUpCarForSaleDto } from './dtos/putUpCarForSale.dto';
import {ExtraFeatureDto} from './dtos/extraFeatures.dto'
import {CarsService} from '../cars/services/cars.service'
import {ExtraFeatureService} from '../cars/services/extra-feature.service'
import { FileInterceptor } from '@nestjs/platform-express';
import {Express} from 'express';
import {diskStorage} from 'multer'



// defining how the image files are stored
const storage = diskStorage({
    // defining where the image files are stored
    destination: function (req, image, cb) {
        cb(null, 'src/uploads')
    },
    // defining what to name image files as in the uploads folder
    filename: function (req, image, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, image.fieldname + '-' + uniqueSuffix)
    },

})


@Controller('cars')
export class CarsController {

    constructor(
        private carsService: CarsService,
        // private extraFeatureService: ExtraFeatureService
        ) {}


    @Post('image')
    @UseInterceptors(FileInterceptor('image'))
    async uploadedFile(@UploadedFile() file) {
        const response = {
            originalFile: file.filename
        }
        return response
    }
    

    @Post()
    @UseInterceptors(FileInterceptor('image', {storage: storage}))
    putUpCarForSale(
        @Body() carProfile: PutUpCarForSaleDto,
        @UploadedFile() image: Express.Multer.File,
        // @Body() extraFeature: ExtraFeatureDto, 
        @Request() request) {
        // extraFeature = this.extraFeatureService.addFeatures(extraFeature)
        const user = request.user
        // if image name does not match jpg|png|jpeg
        if(!image.originalname.match(/\.(jpg|png|jpeg)$/)){throw new BadRequestException("Only image files are allowed")}        
        return this.carsService.putUpCarForSale(
            image.originalname,
            carProfile.style,
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
