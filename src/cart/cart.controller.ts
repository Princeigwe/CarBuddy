import { Controller, Post, Body, Get, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { QueryResult } from 'typeorm';
import {CartService} from './cart.service'
import { CreateProductDto } from './dtos/createProduct.dto';
import {JwtAuthGuard} from '../auth/jwt-auth.guard'
import {RolesGuard} from '../roles.guards'
import { Roles } from '../roles.decorator';
import { Role } from '../enums/role.enum';



@Controller('cart')
export class CartController {
    constructor(private cartService: CartService) {}


    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    getCarts() {
        return this.cartService.getCarts()
    }

    @Get(':cartOwnerEmail')
    getCartsByEmail(@Param('cartOwnerEmail') cartOwnerEmail: string) {
        return this.cartService.getCartByEmail(cartOwnerEmail)
    }


    @Post(':cartOwnerEmail')
    @UseGuards(JwtAuthGuard)
    addToCart (@Param('cartOwnerEmail') cartOwnerEmail: string, @Body() createProduct: CreateProductDto, @Request() request) {
        const user = request.user
        return this.cartService.addToCart(cartOwnerEmail, createProduct.carId, createProduct.quantity, user)
    }

    @Delete()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
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

}
