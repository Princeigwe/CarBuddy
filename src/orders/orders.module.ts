import { Module, forwardRef } from '@nestjs/common';
import { OrdersService } from './orders.service';
import {TypeOrmModule} from '@nestjs/typeorm'
import { OrdersController } from './orders.controller';
import {Order} from './models/order.entity'
import {OrderItem} from './models/orderItem.entity'
import {UsersModule} from '../users/users.module'
import {CartModule} from '../cart/cart.module'
import {ProfilesModule} from '../profiles/profiles.module'



@Module({
  imports: [ 
    TypeOrmModule.forFeature([ Order, OrderItem ]),
    UsersModule,
    CartModule,
    ProfilesModule
  ],
  providers: [OrdersService],
  controllers: [OrdersController]
})
export class OrdersModule {}
