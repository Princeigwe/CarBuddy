import { Controller, Post, Body, Get, Param, Delete, Query } from '@nestjs/common';
import { QueryResult } from 'typeorm';
import {CartService} from './cart.service'
import { CreateProductDto } from './dtos/createProduct.dto';


@Controller('cart')
export class CartController {
    constructor(private cartService: CartService) {}

    @Post()
    createCart(@Body() cartOwnerEmail: string) {
        return this.cartService.createCart(cartOwnerEmail)
    }

    @Get()
    getCartsOrGetByEmail(@Query('email') cartOwnerEmail: string) {
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
    removeFromCart (@Param('cartOwnerEmail') cartOwnerEmail: string, @Query('carId') carId: string) {
        return this.cartService.removeFromCart(cartOwnerEmail, parseInt(carId));
    }
}
