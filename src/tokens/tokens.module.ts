import { Module } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { TokensController } from './tokens.controller';
import {TypeOrmModule} from '@nestjs/typeorm'
import {Token} from './token.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Token])],
  providers: [TokensService],
  controllers: [TokensController]
})
export class TokensModule {}
