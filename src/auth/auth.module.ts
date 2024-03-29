import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { AuthController } from './auth.controller';

import {UsersService } from '../users/users.service'
import { JwtStrategy } from './jwt.strategy';

import {CartModule} from '../cart/cart.module'

@Module({
  imports: [
    forwardRef( () => UsersModule ), 
    forwardRef( () => CartModule),
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: {expiresIn: '300s'}
    })
  ],
  providers: [
    AuthService,
    LocalStrategy, 
    JwtStrategy,
  ], // making authService and all Passport strategies available to the application
  exports: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}