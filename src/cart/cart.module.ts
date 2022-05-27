import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import {Cart, CartSchema } from './cart.schema';
import {CarsModule} from '../cars/cars.module'
import {AuthModule} from '../auth/auth.module'
import {UsersModule} from '../users/users.module'


@Module({
  imports: [
    forwardRef( () => (CarsModule) ),
    forwardRef( () => (AuthModule)),
    forwardRef( () => UsersModule),
    MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }])
  ],
  providers: [CartService],
  controllers: [CartController],
  exports: [CartService]
})
export class CartModule {}
