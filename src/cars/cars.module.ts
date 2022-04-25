import { Module, forwardRef } from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm'
import { CarsService } from './cars.service';
import { CarsController } from './cars.controller';
import {ProfilesModule} from '../profiles/profiles.module'
import {Car} from '../cars/models/cars.entity'
import { ExtraFeature } from './models/extraFeature.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Car, ExtraFeature]),
    forwardRef( () => (ProfilesModule) )
  ], 
  providers: [CarsService],
  controllers: [CarsController]
})
export class CarsModule {}
