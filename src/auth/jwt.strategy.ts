//implementing valid valid jwt Strategy for production/development 

import {ExtractJwt, Strategy} from 'passport-jwt'
import {PassportStrategy} from '@nestjs/passport'
import {Injectable} from '@nestjs/common'
import {jwtConstants} from './constants'
import { UsersService } from '../users/users.service'

// strategy for jwt authentication
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(
        private usersService: UsersService
    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // get jwt from header for user authentication and authorization
            ignoreExpiration: false, //don't ignore jwt expiration
            secretOrKey: jwtConstants.secret,
        })
    }

    async validate(payload: any) { // validate the user with token attached to it
        return this.usersService.findOneById(payload.userId)
    }
}