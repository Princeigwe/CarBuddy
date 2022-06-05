import { Controller, Post, Get, Delete, Patch, Body, Query, Param, Request, UseGuards, HttpException, HttpStatus, UseInterceptors, UploadedFile, BadRequestException, CacheInterceptor, ClassSerializerInterceptor } from '@nestjs/common';
import { CreateUserProfileDto } from './dtos/create-userProfile.dto';
import {ProfilesService} from '../profiles/profiles.service'
import {UpdateUserProfileDto} from './dtos/update-userProfile.dto';
import {JwtAuthGuard} from '../auth/jwt-auth.guard'
import { Roles } from '../roles.decorator';
import {Role} from '../enums/role.enum'
import {RolesGuard} from '../roles.guards'
import {diskStorage} from 'multer'
import { FileInterceptor } from '@nestjs/platform-express';
import {Express} from 'express';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
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

@Controller('profiles')
@ApiTags('Profiles')
export class ProfilesController {

    constructor(
        private profilesService:ProfilesService
    ){}

    @Post()
    @UseGuards(JwtAuthGuard) // to create profile, user must be logged in with jwt token
    // @Roles(Role.Admin, Role.User) // making the profile resource available to users with both admin and user roles, still the same when uncommented
    @UseInterceptors(FileInterceptor('file', {storage: storage}))
    createProfile( @Body() body: CreateUserProfileDto, @Request() request, @UploadedFile() file: Express.Multer.File) {
        const user = request.user

        // if image name does not match jpg|png|jpeg
        if(!file.originalname.match(/\.(jpg|png|jpeg)$/)) { throw new BadRequestException("Only image files are allowed") } 
        
        return this.profilesService.createUserProfile(
            file.originalname,
            body.firstName, 
            body.lastName, 
            body.age, 
            body.maritalStatus, 
            body.telephone, 
            body.address, 
            user
        )
    }
    

    /**
     * 
     * RolesGuard works well with JwtAuthGuard... I think it creates an issue when it is placed alone without JwtAuthGuard
     */

    // adding query parameter to get request fixed the issue of having two GET requests, and one not returning a response
    @Get()
    @ApiImplicitQueries([
        { name: "firstName", description: "fetch profiles by first name", required: false },
    ])
    @UseInterceptors(CacheInterceptor, ClassSerializerInterceptor) // auto-caching response
    // @UseGuards(JwtAuthGuard, RolesGuard) // to query a profile, user must be logged in with jwt token
    @Roles(Role.Admin, Role.User) // making the profile resource available to users with both admin and user roles
    async queryUserProfiles(@Query('firstName') firstName: string) {
        if(firstName) {return await this.profilesService.findFirstName(firstName)}
        return this.profilesService.findAll()
    }
    
    
    @Get(':id')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    getUserProfileById(@Param('id') id: string, @Request() request) { 
        const user = request.user
        return this.profilesService.getUserProfileById(parseInt(id))
    }

    
    @ApiOperation({summary: "This action is only done by the admin user and user of the profile "})
    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    updateUserProfileById(@Param('id') id: string, @Body() body: UpdateUserProfileDto, @Request() request) {
        const user = request.user
        const userProfile = this.profilesService.updateUserProfileById(parseInt(id), body, user)
        return userProfile
    }

    @ApiOperation({summary: "This action is only done by the admin user and user of the profile"})
    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    deleteUserProfileById(@Param('id') id: string, @Request() request) {
        const user = request.user
        return this.profilesService.deleteUserProfileById(parseInt(id), user)
    }
}
