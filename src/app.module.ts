import { Module, forwardRef } from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import { ThrottlerModule} from '@nestjs/throttler'
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import {EventEmitterModule } from '@nestjs/event-emitter'

////////////////////////////////////////
// ENTITIES

import {User} from './users/user.entity'
import {UserProfile} from './profiles/profiles.entity'
import {Report} from './reports/report.entity'
import {Car} from './cars/models/cars.entity'
import {ExtraFeature} from './cars/models/extraFeature.entity'

////////////////////////////////////////


import { AuthModule } from './auth/auth.module';
import { ProfilesModule } from './profiles/profiles.module';
import { CaslModule } from './casl/casl.module';
import { CarsModule } from './cars/cars.module';
import {MulterModule} from  '@nestjs/platform-express'
import { ServeStaticModule } from '@nestjs/serve-static';
import {join} from 'path'
import { CartModule } from './cart/cart.module';



@Module({
  imports: [ 
    MongooseModule.forRoot('mongodb://mongo:mongo@car_mongodb'),

    

    TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'car_postgres', // the host should be the name of the postgres container... that was how I was able to connect.
    port: 5432,
    // port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE_NAME,
    entities: [User, Report, UserProfile, Car, ExtraFeature],
    synchronize: true,
    ////////////////////////////////////////////////
    // type: 'sqlite', 
    // database: 'db.sqlite', 
    // entities: [User, Report, UserProfile],
    // autoLoadEntities: true, // to automatically load entities
    // synchronize: true, // automatically change structure of data entities when changes apply. Should be used only for development environment
  }),
  UsersModule,
  ReportsModule,
  AuthModule,
  ThrottlerModule.forRoot({
    ttl: 60,
    limit: 10, // limiting number of requests to API to 10 in 60 seconds
  }),
  ProfilesModule,
  CaslModule,
  CarsModule,
  CartModule,
  EventEmitterModule.forRoot(),
  // ServeStaticModule.forRoot({
  //   rootPath: join(__dirname, '..', 'uploads'),
  // })
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
