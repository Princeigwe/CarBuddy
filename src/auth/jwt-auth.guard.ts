// jwt guard that will work with production`

import {Injectable, UnauthorizedException} from '@nestjs/common'
import {AuthGuard} from '@nestjs/passport'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}