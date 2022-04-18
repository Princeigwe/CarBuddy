import { Module, forwardRef } from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import { ThrottlerModule} from '@nestjs/throttler'
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import {User} from './users/user.entity'
import {Report} from 'src/reports/report.entity'
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [ TypeOrmModule.forRoot({
    type: 'sqlite', 
    database: 'db.sqlite', 
    entities: [User, Report],
    synchronize: true // automatically change structure of data entities when changes apply. Should be used only for development environment
  }),
  UsersModule,
  ReportsModule,
  AuthModule,
  ThrottlerModule.forRoot({
    ttl: 60,
    limit: 10, // limiting number of requests to API to 10 in 60 seconds
  }),
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
