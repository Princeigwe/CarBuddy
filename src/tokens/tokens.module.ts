import { Module } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { TokensController } from './tokens.controller';
import {TypeOrmModule} from '@nestjs/typeorm'
import {Token} from './token.entity'
import {UsersModule} from '../users/users.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Token]),
    UsersModule,
  ],
  providers: [TokensService],
  controllers: [TokensController]
})
export class TokensModule {}
