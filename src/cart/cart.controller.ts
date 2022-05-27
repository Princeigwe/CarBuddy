import { Controller, Post, Body, Get, Param, Delete, Query } from '@nestjs/common';
import { QueryResult } from 'typeorm';
import {CartService} from './cart.service'
import { CreateProductDto } from './dtos/createProduct.dto';


@Controller('cart')
export class CartController {
    constructor(private cartService: CartService) {}


    @Get()
    getCartsOrGetByEmail(@Query('email') cartOwnerEmail: string) {
        // if email is given as a query parameter ...
        if (cartOwnerEmail) { 
            return this.cartService.getCartByEmail(cartOwnerEmail)
        }
        return this.cartService.getCarts()
    }


    @Post(':cartOwnerEmail')
    addToCart (@Param('cartOwnerEmail') cartOwnerEmail: string, @Body() createProduct: CreateProductDto) {
        return this.cartService.addToCart(cartOwnerEmail, createProduct.carId, createProduct.quantity)
    }

    @Delete()
    deleteCarts() {
        return this.cartService.deleteCarts()
    }

    @Delete(':cartOwnerEmail')
    clearCartOrRemoveFromCart (@Param('cartOwnerEmail') cartOwnerEmail: string, @Query('carId') carId: string) {
        // if carId is given as a query parameter
        if(carId) {
            return this.cartService.removeFromCart(cartOwnerEmail, parseInt(carId));
        }
        return this.cartService.clearCart(cartOwnerEmail)
    }

    // @Delete(':cartOwnerEmail')
    // clearCart(@Param('cartOwnerEmail') cartOwnerEmail: string) {
    //     return this.cartService.clearCart(cartOwnerEmail)
    // }
}
