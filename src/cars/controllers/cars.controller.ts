import { Controller, Post, Patch, Get, Delete, Body, Request, UseInterceptors, UploadedFile, Header, BadRequestException, Response, Param, StreamableFile, Query, UseGuards } from '@nestjs/common';
import { PutUpCarForSaleDto } from '../dtos/putUpCarForSale.dto';
import {JwtAuthGuard} from '../../auth/jwt-auth.guard'
import {CarsService} from '../services/cars.service'
import { FileInterceptor } from '@nestjs/platform-express';
import {Express} from 'express';
import {diskStorage} from 'multer'
import {RolesGuard} from '../../roles.guards'
import {Role} from '../../enums/role.enum'
import {Roles} from '../../roles.decorator'
import {CarAvailability} from '../../enums/carAvailability.enum'

// import {ExtraFeatureDto} from '../dtos/extraFeatures.dto'
// import {ExtraFeatureService} from '../cars/services/extra-feature.service'
// import {DriveType} from '../../enums/driveType.enum'
// import {ExtraFeature} from '../models/extraFeature.entity'
// import { of } from 'rxjs';
// import {join} from 'path'
// import { createReadStream } from 'fs'
// const path = require('path')



// defining how the image files are stored
const storage = diskStorage({
    // defining where the image files are stored
    destination: function (req, image, cb) {
        cb(null, 'uploads')
    },
    // defining what to name image files as in the uploads folder
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.originalname + '-' + uniqueSuffix)
    },

})


@Controller('cars')
export class CarsController {

    constructor(private carsService: CarsService) {}

    // I used this piece of code to test image upload

    // @Post('image')
    // @UseInterceptors(FileInterceptor('file',{storage: storage}))
    // async uploadedFile(@UploadedFile() file:  Express.Multer.File) {
    //     const response = {
    //         originalFile: file.originalname
    //     }
    //     return response
    // }


    @Post()
    @UseGuards(JwtAuthGuard) // login required to put up car for sale
    @UseInterceptors(FileInterceptor('file', {storage: storage}))
    putUpCarForSale( @Body() carProfile: PutUpCarForSaleDto, @UploadedFile() file: Express.Multer.File, @Request() request) {
        const user = request.user

        // if image name does not match jpg|png|jpeg
        if(!file.originalname.match(/\.(jpg|png|jpeg)$/)) { throw new BadRequestException("Only image files are allowed") }   

        return this.carsService.putUpCarForSale(
            file.originalname,
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
        )
    }

    /**
     * TODO: this method should only be accessed by the Admin user
     * This is to get all cars for sale in the database, both [Private and Public]. THis should only be accessed by the Admin user
     */
    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin) // getting all cars (both private and public) should only be accessed by the Admin user
    getAllCarsForSaleOrByQuery() {
        return this.carsService.getAllCarsForSale()
    }

    // GET endpoint with(out) query parameters
    @Get('public')
    getAllPublicCarsForSale(@Query('brand') brand?: string, @Query('estPrice') estPrice?: any, @Query('driveType') driveType?: string, @Query('useType') useType?: string) {
        if( estPrice || driveType || useType || brand ) { 
            return this.carsService.queryPublicCarsByBrandOrAndEstimatedPriceOrAndDriveTypeOrAndUseType( brand, estPrice, driveType, useType) 
        }
        return this.carsService.getAllPublicCarsForSale()
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async getCarForSaleById (@Param('id') id: string, @Request() request) {
        const user = request.user
        return this.carsService.getCarForSaleById(parseInt(id), user)
    }

    @Delete()
    deleteCarsForSale () { 
        return this.carsService.deleteCarForSale()
    }
}
