import { Module, forwardRef, CacheModule } from '@nestjs/common';
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
import { Order } from './orders/models/order.entity';
import {OrderItem} from './orders/models/orderItem.entity';
import {Token} from './tokens/token.entity'

////////////////////////////////////////


import { AuthModule } from './auth/auth.module';
import { ProfilesModule } from './profiles/profiles.module';
import { CaslModule } from './casl/casl.module';
import { CarsModule } from './cars/cars.module';
import {MulterModule} from  '@nestjs/platform-express'
import { ServeStaticModule } from '@nestjs/serve-static';
import {join} from 'path'
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { TokensModule } from './tokens/tokens.module';



@Module({
  imports: [ 
    CacheModule.register({
      ttl: 100, // cache items time to live set to 100 seconds
      isGlobal: true // setting the cache module to be used globally in other modules
    }),
    MongooseModule.forRoot(process.env.MONGO_DATABASE_URI),

    TypeOrmModule.forRoot({
    type: 'postgres',
    host: process.env.NODE_ENV == "production"? process.env.RDS_HOSTNAME : process.env.DB_HOST, // the host should be the name of the postgres container... that was how I was able to connect.
    port: process.env.NODE_ENV == "production"? parseInt(process.env.RDS_PORT) : parseInt(process.env.DB_PORT),


    // port: process.env.DB_PORT,

    // these environment variables are related to AWS RDS variables
    username: process.env.NODE_ENV == "production"? process.env.RDS_USERNAME : process.env.DB_USERNAME,
    password: process.env.NODE_ENV == "production"? process.env.RDS_PASSWORD : process.env.DB_PASSWORD,
    database: process.env.NODE_ENV == "production"? process.env.RDS_DB_NAME : process.env.DB_NAME,
    entities: [User, Report, UserProfile, Car, ExtraFeature, Order, OrderItem, Token],
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
  OrdersModule,
  TokensModule,
  // ServeStaticModule.forRoot({
  //   rootPath: join(__dirname, '..', 'uploads'),
  // })
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
