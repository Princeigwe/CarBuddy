import { Module, forwardRef } from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm'
import { CarsService } from './services/cars.service';
import { CarsController } from './cars.controller';
import {ProfilesModule} from '../profiles/profiles.module'
import {Car} from '../cars/models/cars.entity'
import { ExtraFeature } from './models/extraFeature.entity';
import { ExtraFeatureService } from './services/extra-feature.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Car, ExtraFeature]),
    forwardRef( () => (ProfilesModule) )
  ], 
  providers: [CarsService, ExtraFeatureService],
  controllers: [CarsController]
})
export class CarsModule {}
