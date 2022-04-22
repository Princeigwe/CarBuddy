import { Controller, Post, Get, Delete, Patch, Body, Query, Param, Request, UseGuards } from '@nestjs/common';
import { CreateUserProfileDto } from './dtos/create-userProfile.dto';
import {ProfilesService} from '../profiles/profiles.service'
import {UpdateUserProfileDto} from './dtos/update-userProfile.dto';
import {JwtAuthGuard} from 'src/auth/jwt-auth.guard'

@Controller('profiles')
export class ProfilesController {

    constructor(
        private profilesService:ProfilesService
    ){}

    @Post()
    @UseGuards(JwtAuthGuard)
    createProfile(
        @Body() body: CreateUserProfileDto,
        // @Request() request
        ) {
        // const user = request.user
        return this.profilesService.createUserProfile(
            // user,
            body.firstName, 
            body.lastName, 
            body.age, 
            body.maritalStatus, 
            body.telephone, 
            body.address,
        )
    }
    
    // adding query parameter to get request fixed the issue of having two GET requests, and one not returning a response
    @Get()
    async queryUserProfiles(@Query('firstName') firstName: string) {
        if(firstName) {return await this.profilesService.findFirstName(firstName)}
        return this.profilesService.findAll()
    }
    
    @Get(':id')
    getUserProfileById(@Param('id') id: string) { 
        return this.profilesService.getUserProfileById(parseInt(id))
    }

    

    // @Patch(':id')
    // updateUserProfileById(@Param('id') id: string, @Body() body: UpdateUserProfileDto) {
    //     const userProfile = this.profilesService.updateUserProfileById(parseInt(id), body)
    //     return userProfile
    // }

    @Delete(':id')
    deleteUserProfileById(@Param('id') id: string) {
        return this.profilesService.deleteUserProfileById(parseInt(id))
    }
}
