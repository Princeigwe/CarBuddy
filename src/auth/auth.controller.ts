import { Controller, Get, Request, Post, UseGuards, Body, HttpCode, Res } from '@nestjs/common';
import {AuthService} from './auth.service'
import {CreateUserDto} from '../users/dtos/create-user.dto'
import {LocalAuthGuard} from './local-auth.guard'

@Controller('auth')
export class AuthController{
    constructor(
        private authService: AuthService
    ){}

    @Post('register')
    async register(@Body() body) {
        return this.authService.register(body.email, body.password, body.username)
    }

    @HttpCode(200)
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() request, @Res() response) {
        const {user} = request
        const cookie = this.authService.getCookieWithJwtToken(user.id)
        response.cookie(cookie, {httpOnly: true}) // attaching jwt token to cookie in response
        return response.send(user)
    }

}