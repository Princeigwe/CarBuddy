import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
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
    getCarts() {
        return this.cartService.getCarts()
    }

    // @Post(':cartOwnerEmail')
    // addToCart (@Param('cartOwnerEmail') cartOwnerEmail: string, @Body() createProduct: CreateProductDto) {
    //     return this.cartService.addToCart(cartOwnerEmail, createProduct)
    // }


    // 'id' here is the car ID. 'carId' as body gives an entity column error
    @Post(':cartOwnerEmail')
    addToCart (@Param('cartOwnerEmail') cartOwnerEmail: string, @Body() createProduct: CreateProductDto) {
        return this.cartService.addToCart(cartOwnerEmail, createProduct.carId, createProduct.quantity)
    }

    @Delete()
    deleteCarts() {
        return this.cartService.deleteCarts()
    }
}
