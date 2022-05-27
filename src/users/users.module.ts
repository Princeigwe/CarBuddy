import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import {User} from './user.entity'
import { AuthService } from './auth.service';
import {AuthModule} from '../auth/auth.module'
import {ProfilesModule} from '../profiles/profiles.module'
import {CartModule} from '../cart/cart.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef( () => AuthModule ),
    forwardRef( () => ProfilesModule),
    forwardRef( () => CartModule),
  ],
  controllers: [UsersController],
  providers: [UsersService, AuthService],
  exports: [UsersService]
})
export class UsersModule {}
