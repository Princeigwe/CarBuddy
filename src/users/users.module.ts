import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import {User} from './user.entity'
import { AuthService } from './auth.service';
import {AuthModule} from '../auth/auth.module'
import {JwtModule} from '@nestjs/jwt'

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef( () => AuthModule ),
    JwtModule.register({
      secret: 'secret', // this value should be in an env file, and it can be any value
      signOptions: {
        expiresIn: '1d'
      }
    })
],
  controllers: [UsersController],
  providers: [UsersService, AuthService],
  exports: [UsersService]
})
export class UsersModule {}
