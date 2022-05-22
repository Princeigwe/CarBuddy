import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import {Cart, CartSchema } from './cart.schema';
import {Product, ProductSchema } from './cart.schema';
import {CarsModule} from '../cars/cars.module'


@Module({
  imports: [
    forwardRef( () => (CarsModule) ),
    MongooseModule.forFeature([
      { name: Cart.name, schema: CartSchema }, 
      { name: Product.name, schema: ProductSchema }]
    )],
  providers: [CartService],
  controllers: [CartController]
})
export class CartModule {}
