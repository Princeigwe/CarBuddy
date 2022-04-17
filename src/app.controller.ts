import { Controller, Get, Request, Post, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';
import {LocalAuthGuard} from './auth/local-auth.guard'
import {AuthService} from './auth/auth.service'
import {JwtAuthGuard} from './auth/jwt-auth.guard'

@Controller()
export class AppController {

//   constructor(private authService: AuthService){}


//   @UseGuards(LocalAuthGuard)
//   @Post('auth/login')
//   async login(@Request() req) {
//     return this.authService.login(req.user)
//   }

//   @UseGuards(JwtAuthGuard)
//   @Get('profile')
//   getProfile(@Request() req) {
//     return req.user
//   }



  // @UseGuards(AuthGuard('local'))
  // @Post('auth/login')
  // async login(@Request() req) {
  //   return req.user;
  // }

  // constructor(private readonly appService: AppService) {}

  // @Get()
  // getHello(): string {
  //   return this.appService.getHello();
  // }
}
