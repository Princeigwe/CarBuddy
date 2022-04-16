import {Injectable, Post, Request, UseGuards} from '@nestjs/common'
import {AuthGuard} from '@nestjs/passport'

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
    @UseGuards(LocalAuthGuard)
    @Post('auth/login')
    async login(@Request() req) {
        return req.user
    }
}