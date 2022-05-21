import { Module, forwardRef } from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm'
import { CarsService } from './services/cars.service';
import { CarsController } from './controllers/cars.controller';
import {ProfilesModule} from '../profiles/profiles.module'
import {Car} from '../cars/models/cars.entity'
import {ExtraFeature} from '../cars/models/extraFeature.entity'
import { ExtraFeatureService } from './services/extra-feature.service';
import { ExtraFeatureController } from './controllers/extra-feature.controller';
import {CaslModule} from '../casl/casl.module'


@Module({
  imports: [
    TypeOrmModule.forFeature([Car, ExtraFeature]),
    forwardRef( () => (ProfilesModule) ),
    forwardRef( () => (CaslModule) ),
  ], 
  providers: [CarsService, ExtraFeatureService],
  controllers: [CarsController, ExtraFeatureController],
  exports: [CarsService]
})
export class CarsModule {}
