// the local guard that will work for authenticating username and password

import {Injectable, Post, Request, UseGuards} from '@nestjs/common'
import {AuthGuard} from '@nestjs/passport'

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}// class to use Local Strategy for authentication
