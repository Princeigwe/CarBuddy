import { Controller, Post, Body, Get, Delete, Patch, Query, Param, NotFoundException, UseInterceptors, ClassSerializerInterceptor, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import {UpdateUserDto} from './dtos/update-user.dto'
import {LoginUserDto} from './dtos/login-user.dto'
import {UsersService } from './users.service'
import {AuthService} from './auth.service' // import AuthService to be used
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {RolesGuard} from '../roles.guards';
import {Roles} from '../roles.decorator'
import {Role} from '../enums/role.enum'


@Controller('users')
export class UsersController {
    constructor(
        private usersService: UsersService,
        private authService: AuthService,
        ){}

    // adding query parameter to get request fixed the issue of having two GET requests, and one not returning a response
    @UseInterceptors(ClassSerializerInterceptor)
    @Get() // get users with(out) query
    async retrieveAllUsers(@Query('email') email:string ){
        if (email) { return await this.usersService.find(email)}
        return this.usersService.findAll()
    }

    // intercept the incoming request and make changes to it
    @UseInterceptors(ClassSerializerInterceptor)
    @Get(':id') // Get request with Parameter
    async findUser(@Param('id') id: string) {
        // change the ID parameter to number, and call the service on it 
        const user = await this.usersService.findOneById(parseInt(id))
        if (!user) {
            throw new NotFoundException(`User with id ${id} not found`)
        }
        return user
    }

    @Delete(':id') // delete request on a user
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    removeUser(@Param('id') id: string) {
        return this.usersService.remove(parseInt(id))
    }

    @Delete()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    removeUsers() {
        return this.usersService.removeAll()
    }

    @Patch(':id') // patch request to update a user
    async updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) { 
        const user = await this.usersService.update(parseInt(id), body)
        if (!user) {
            throw new NotFoundException(`User with id ${id} not found`)
        }
        return user
    }
}
