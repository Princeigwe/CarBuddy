import { Controller, Post, Body, Get, Delete, Patch, Query, Param, NotFoundException, UseInterceptors, ClassSerializerInterceptor, Session, Res } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import {UpdateUserDto} from './dtos/update-user.dto'
import {LoginUserDto} from './dtos/login-user.dto'
import {UsersService } from './users.service'
import {AuthService} from './auth.service' // import AuthService to be used



@Controller('users')
export class UsersController {
    constructor(
        private usersService: UsersService,
        private authService: AuthService,
        ){}

    @UseInterceptors(ClassSerializerInterceptor)
    @Get() // get users without query
    retrieveAllUsers(){
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

    @Get() // get request to retrieve users with the query string "email" provided
    async findAllUsers(@Query('email') email: string) {
        const users = await this.usersService.find(email)
        return users
    }

    @Delete(':id') // delete request on a user
    removeUser(@Param('id') id: string) {
        return this.usersService.remove(parseInt(id))
    }

    @Delete()
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
