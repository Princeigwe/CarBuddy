import { Controller, Get, Request, Post, UseGuards, Body, HttpCode, Res, Req } from '@nestjs/common';
import {AuthService} from './auth.service'
import {CreateUserDto} from '../users/dtos/create-user.dto'
import {LocalAuthGuard} from './local-auth.guard'
import {JwtAuthGuard} from './jwt-auth.guard'
import { ApiOperation, ApiTags, ApiBody } from '@nestjs/swagger';
import {ChangePasswordDto} from '../users/dtos/change-password.dto'


@Controller('auth')
@ApiTags("Auth")
export class AuthController{
    constructor(
        private authService: AuthService
    ){}

    @Post('register')
    async register(@Body() body: CreateUserDto) {
        return this.authService.register( body.username, body.email, body.password, body.role)
    }


    /* 
    on the endpoint 'auth/login' call Use the Guard - LocalAuthGuard
    which will require the user to authenticate with username and password,
    and attach a token to the response token.
    */
    @ApiOperation({
        summary: 'To log into the service, with {email, password}',
    })
    @HttpCode(200)
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() request, @Res() response) {
        const {user} = request
        const cookie = this.authService.getCookieWithJwtToken(user.id)
        response.cookie('cookie-jwt',cookie, {httpOnly: true}) // attaching jwt token to cookie in response
        return response.send(user)
    }

    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    @Post('logout')
    async logout(@Req() request, @Res() response) {
        response.setHeader('Set-Cookie', this.authService.getCookieForLogOut());
        return response.sendStatus(200);
    }

    @UseGuards(JwtAuthGuard)
    @Post('change-password')
    async changePassword(@Body() body: ChangePasswordDto, @Request() request) {
        const user = request.user
        return this.authService.changePassword(body.password, body.confirmPassword, user.email)
    } 
}