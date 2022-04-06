import { Controller, Post, Body, Get, Delete, Patch, Query, Param, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import {UpdateUserDto} from './dtos/update-user.dto'
import {UsersService } from './users.service'

@Controller('auth')
export class UsersController {
    constructor(private usersService: UsersService){}
    
    @Post('/signUp')
    // extract the body of POST request and verify it's of CreateUserDto
    createUser(@Body() body:CreateUserDto) {
        return this.usersService.create(body.email, body.password) // calling the createUser from UsersService
    }

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
    findAllUsers(@Query('email') email: string) {
        return this.usersService.find(email)
    }

    @Delete('/:id') // delete request on a user
    removeUser(@Param('id') id: string) {
        return this.usersService.remove(parseInt(id))
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
