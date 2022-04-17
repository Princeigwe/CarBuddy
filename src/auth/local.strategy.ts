import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';


// strategy for Local authentication [with username and password]
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
    super({usernameField: 'email'});
}

    async validate(email: string, password: string) {
        const user = await this.authService.getAuthenticatedUser(email, password);
        return user;
    }
}