import { Module } from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm'
import { ProfilesService } from './profiles.service';
import { ProfilesController } from './profiles.controller';
import {UserProfile} from './profiles.entity'

@Module({
  imports: [TypeOrmModule.forFeature([UserProfile])],
  providers: [ProfilesService],
  controllers: [ProfilesController]
})
export class ProfilesModule {}
