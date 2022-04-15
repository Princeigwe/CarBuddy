import { Controller, Post, Body, Get, Delete, Patch, Query, Param, NotFoundException, UseInterceptors, ClassSerializerInterceptor, Session } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import {UpdateUserDto} from './dtos/update-user.dto'
import {UsersService } from './users.service'
import {AuthService} from './auth.service' // import AuthService to be used


@Controller('auth')
export class UsersController {
    constructor(
        private usersService: UsersService,
        private authService: AuthService
        ){}

    
    
    @Post('/signUp')
    // extract the body of POST request and verify it's of CreateUserDto
    createUser(@Body() body:CreateUserDto) {
        return this.usersService.create(body.email, body.password) // calling the createUser from UsersService
        // return this.authService.signUp(body.email, body.password) // calling the AuthService to create a user 
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get() // get users without query
    retrieveAllUsers(){
        return this.usersService.findAll()
    }

    @Post('/signin')
    // calling the authService to sign in user
    loginUser(@Body() body:CreateUserDto){
        return this.authService.signIn(body.email, body.password)
    }

    // intercept the incoming request and make changes to it
    @UseInterceptors(ClassSerializerInterceptor)
    @Get('/:id') // Get request with Parameter
    async findUser(@Param('id') id: string) {
        // change the ID parameter to number, and call the service on it 
        const user = await this.usersService.findOne(parseInt(id))
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

    @Delete('/:id') // delete request on a user
    removeUser(@Param('id') id: string) {
        return this.usersService.remove(parseInt(id))
    }

    @Delete()
    removeUsers() {
        return this.usersService.removeAll()
    }

    @Patch('/:id') // patch request to update a user
    async updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) { 
        const user = await this.usersService.update(parseInt(id), body)
        if (!user) {
            throw new NotFoundException(`User with id ${id} not found`)
        }
        return user
    }
}
