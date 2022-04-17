import { Controller, Get, Request, Post, UseGuards, Body, HttpCode, Res } from '@nestjs/common';
import {AuthService} from './auth.service'
import {CreateUserDto} from '../users/dtos/create-user.dto'
import {LocalAuthGuard} from './local-auth.guard'
import {JwtAuthGuard} from './jwt-auth.guard'

@Controller('auth')
export class AuthController{
    constructor(
        private authService: AuthService
    ){}

    @Post('register')
    async register(@Body() body: CreateUserDto) {
        return this.authService.register( body.username, body.email, body.password)
    }


    /* 
    on the endpoint 'auth/login' call Use the Guard - LocalAuthGuard
    which will require the user to authenticate with username and password,
    and attach a token to the response token.
    */
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