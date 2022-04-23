import { Module, forwardRef } from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm'
import { ProfilesService } from './profiles.service';
import { ProfilesController } from './profiles.controller';
import {UserProfile} from './profiles.entity'
import {UsersModule} from '../users/users.module'
import {CaslModule} from '../casl/casl.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([UserProfile]),
    forwardRef( () => UsersModule ),
    forwardRef( () => CaslModule),
  ],
  providers: [ProfilesService],
  controllers: [ProfilesController],
  exports: [ProfilesService, TypeOrmModule]
})
export class ProfilesModule {}
