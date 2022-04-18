import { Controller, Get, Request, Post, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';
import {LocalAuthGuard} from './auth/local-auth.guard'
import {AuthService} from './auth/auth.service'
import {JwtAuthGuard} from './auth/jwt-auth.guard'

@Controller()
export class AppController {}
