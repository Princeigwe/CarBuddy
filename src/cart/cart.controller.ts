import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import {CartService} from './cart.service'

@Controller('cart')
export class CartController {
    constructor(private cartService: CartService) {}

    @Post()
    createCart(@Body() cartOwnerEmail: string) {
        return this.cartService.createCart(cartOwnerEmail)
    }

    @Get()
    getCarts() {
        return this.cartService.getCarts()
    }

    @Post(':cartOwnerEmail')
    addToCart (@Param('cartOwnerEmail') cartOwnerEmail: string, @Body() productName: string, @Body() quantity: number, @Body() price: number) {
        return this.cartService.addToCart(cartOwnerEmail, productName, quantity, price)
    }

    @Delete()
    deleteCarts() {
        return this.cartService.deleteCarts()
    }
}
