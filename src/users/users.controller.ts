import { Controller, Post, Body } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import {UsersService } from './users.service'

@Controller('auth')
export class UsersController {
    constructor(private usersService: UsersService){}
    
    @Post('/signUp')
    // extract the body of POST request and verify it's of CreateUserDto
    createUser(@Body() body:CreateUserDto) {
        return this.usersService.create(body.email, body.password) // calling the createUser from UsersService
    }
}
