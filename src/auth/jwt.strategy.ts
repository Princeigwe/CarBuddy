//implementing valid valid jwt Strategy for production/development 

import {ExtractJwt, Strategy} from 'passport-jwt'
import {PassportStrategy} from '@nestjs/passport'
import {Injectable} from '@nestjs/common'
import {jwtConstants} from './constants'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // get jwt from header for user authentication and authorization
            ignoreExpiration: false, //don't ignore jwt expiration
            secretOrKey: jwtConstants.secret,
        })
    }

    async validate(payload: any) { // validate the user making the request to give token
        return {userId: payload.sub, username: payload.username}
    }
}