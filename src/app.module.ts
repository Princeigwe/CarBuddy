import { Module } from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import {User} from './users/user.entity'
import {Report} from 'src/reports/report.entity'

@Module({
  imports: [ TypeOrmModule.forRoot({
    type: 'sqlite', 
    database: 'db.sqlite', 
    entities: [User, Report],
    synchronize: true // automatically change structure of data entities when changes apply. Should be used only for development environment
  }),
  UsersModule,
  ReportsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
