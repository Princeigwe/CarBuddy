import { Controller, Post, Patch, Get, Delete, Body, Request, UseInterceptors, UploadedFile, Header, BadRequestException, Response, Param, StreamableFile, Query, UseGuards, CacheInterceptor, ClassSerializerInterceptor } from '@nestjs/common';
import { PutUpCarForSaleDto } from '../dtos/putUpCarForSale.dto';
import { UpdateCarForSaleDto } from '../dtos/updateCarForSale.dto';
import {JwtAuthGuard} from '../../auth/jwt-auth.guard'
import {CarsService} from '../services/cars.service'
import { FileInterceptor } from '@nestjs/platform-express';
import {Express} from 'express';
import {diskStorage} from 'multer'
import {RolesGuard} from '../../roles.guards'
import {Role} from '../../enums/role.enum'
import {Roles} from '../../roles.decorator'
import {CarAvailability} from '../../enums/carAvailability.enum'
import {ApiParam, ApiTags, ApiConsumes, ApiOperation} from '@nestjs/swagger'

// " npm install nestjs-swagger-api-implicit-queries-decorator --save " was executed
import { ApiImplicitQueries } from 'nestjs-swagger-api-implicit-queries-decorator';


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
@ApiTags("Cars") // grouping the endpoints
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
    @ApiConsumes('multipart/form-data') // request body API documentation
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
    @ApiOperation({summary: "This action is only done by the admin user"})
    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @UseInterceptors(CacheInterceptor, ClassSerializerInterceptor)
    @Roles(Role.Admin) // getting all cars (both private and public) should only be accessed by the Admin user
    getAllCarsForSale() {
        return this.carsService.getAllCarsForSale()
    }


    // GET endpoint with(out) query parameters
    @Get('public')
    // openAPI array of queries
    @ApiImplicitQueries([
        {name: 'brand', description: 'fetch cars by brand', required: false},
        {name: 'estPrice', description: 'fetch cars by estimated price', required: false},
        {name: 'driveType', description: 'fetch cars by drive types', required: false},
        {name: 'useType', description: 'fetch cars by use types', required: false},
    ])
    @UseInterceptors(CacheInterceptor, ClassSerializerInterceptor)
    getAllPublicCarsForSale(@Query('brand') brand?: string, @Query('estPrice') estPrice?: any, @Query('driveType') driveType?: string, @Query('useType') useType?: string) {
        if( estPrice || driveType || useType || brand ) { 
            return this.carsService.queryPublicCarsByBrandOrAndEstimatedPriceOrAndDriveTypeOrAndUseType( brand, estPrice, driveType, useType) 
        }
        return this.carsService.getAllPublicCarsForSale()
    }

    @ApiOperation({summary: "This action is only done by the admin user and car dealer, if the car is made private"})
    @Get(':id')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    async getCarForSaleById (@Param('id') id: string, @Request() request) {
        const user = request.user
        return this.carsService.getCarForSaleById(parseInt(id), user)
    }

    @ApiOperation({summary: "This action is only done by the admin user and car dealer"})
    @Patch(':id')
    @ApiConsumes('multipart/form-data') // request body type for API documentation
    @UseGuards(JwtAuthGuard)
    editCarForSale ( @Param('id') id: string, @Body() car: UpdateCarForSaleDto, @Request() request) {
        const user = request.user
        return this.carsService.editCarForSale( parseInt(id), car, user )
    }

    @Patch('/image/:id')
    @UseInterceptors(FileInterceptor('file', {storage: storage}))
    updateCarImageById( @Param('id') id: number, @UploadedFile() file: Express.Multer.File) {
        return this.carsService.updateCarImageById(id, file)
    }

    @ApiOperation({summary: "This action is only done by the admin user"})
    @Delete()
    @UseGuards(JwtAuthGuard)
    @Roles(Role.Admin) // deleting all data from base, should be done only by the Admin User
    deleteAllCarsForSale () { 
        return this.carsService.deleteAllCarsForSale()
    }

    @ApiOperation({summary: "This action is only done by the admin user and car dealer"})
    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    deleteCarForSaleById ( @Param('id') id: string , @Request() request) {
        const user = request.user
        return this.carsService.deleteCarForSaleById(parseInt(id), user)
    }
}
