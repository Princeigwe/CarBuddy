import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import {UsersService } from '../users/users.service'

@Module({
  imports: [
    forwardRef( () => UsersModule ), 
    PassportModule],
  providers: [AuthService,LocalStrategy]
})
export class AuthModule {}
