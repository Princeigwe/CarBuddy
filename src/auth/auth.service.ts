import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import {JwtService} from '@nestjs/jwt'


@Injectable()
export class AuthService {
    constructor(private usersService: UsersService, private jwtService: JwtService) {}
    async validateUser(email: string, pass: string): Promise<any> {
        // const user = await this.usersService.findUsername(username);  // the real thing with database
        const user = await this.usersService.findOne(email); // for testing purposes
        if (user && user.password === pass) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    // remember this is for the test database (userId)
    async login(user: any){
        const payload = {email: user.email, sub: user.userId}
        return {
            access_token: this.jwtService.sign(payload) // signing jwt to user payload
        }
    }
}
