import { Module, forwardRef } from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm'
import { ProfilesService } from './profiles.service';
import { ProfilesController } from './profiles.controller';
import {UserProfile} from './profiles.entity'
import {UsersModule} from '../users/users.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([UserProfile]),
    forwardRef( () => UsersModule ),
  ],
  providers: [ProfilesService],
  controllers: [ProfilesController],
  exports: [ProfilesService, TypeOrmModule]
})
export class ProfilesModule {}
