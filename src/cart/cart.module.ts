import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import {Cart, CartSchema } from './cart.schema';
import {CarsModule} from '../cars/cars.module'
import {AuthModule} from '../auth/auth.module'


@Module({
  imports: [
    forwardRef( () => (CarsModule) ),
    forwardRef( () => (AuthModule)),
    MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }])
  ],
  providers: [CartService],
  controllers: [CartController],
  exports: [CartService]
})
export class CartModule {}
