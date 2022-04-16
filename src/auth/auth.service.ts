import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import {JwtService} from '@nestjs/jwt'


@Injectable()
export class AuthService {
    constructor(private usersService: UsersService, private jwtService: JwtService) {}
    async validateUser(email: string, password: string) {
        const user = await this.usersService.findOne(email);  
        if (user && user.password === password) {
            // const { password, ...result } = user;
            return user;
        }
        // return null;
    }

    // remember this is for the test database (userId)
    async login(user: any){
        const payload = {email: user.email, sub: user.userId}
        return {
            access_token: this.jwtService.sign(payload) // signing jwt to user payload
        }
    }
}
