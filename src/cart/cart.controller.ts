import { Controller, Post, Body, Get, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { QueryResult } from 'typeorm';
import {CartService} from './cart.service'
import { CreateProductDto } from './dtos/createProduct.dto';
import {JwtAuthGuard} from '../auth/jwt-auth.guard'
import {RolesGuard} from '../roles.guards'
import { Roles } from '../roles.decorator';
import { Role } from '../enums/role.enum';
import { ApiParam, ApiTags, ApiOperation } from '@nestjs/swagger';
import { ApiImplicitQueries } from 'nestjs-swagger-api-implicit-queries-decorator';



@Controller('cart')
@ApiTags("Cart")
export class CartController {
    constructor(private cartService: CartService) {}


    @ApiOperation({summary: "This action is only done by the admin user"})
    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    getCarts() {
        return this.cartService.getCarts()
    }

    @ApiOperation({summary: "This action is only done by the admin user and cart owner"})
    @Get(':cartOwnerEmail')
    @ApiParam({name:'cartOwnerEmail', description: "Gets the user's cart by email", required: true}) // Param doc for Swagger
    @UseGuards(JwtAuthGuard)
    getCartsByEmail(@Param('cartOwnerEmail') cartOwnerEmail: string, @Request() request) {
        const user = request.user
        return this.cartService.getCartByEmail(cartOwnerEmail, user)
    }


    @ApiOperation({summary: "This action is only done by the admin user and cart owner"})
    @Post(':cartOwnerEmail')
    @ApiParam({name:'cartOwnerEmail', description: "Adds item to cart by email", required: true}) // Param doc for Swagger
    @UseGuards(JwtAuthGuard)
    addToCart (@Param('cartOwnerEmail') cartOwnerEmail: string, @Body() createProduct: CreateProductDto, @Request() request) {
        const user = request.user
        return this.cartService.addToCart(cartOwnerEmail, createProduct.carId, createProduct.quantity, user)
    }

    @ApiOperation({summary: "This action is only done by the admin user"})
    @Delete()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    deleteCarts() {
        return this.cartService.deleteCarts()
    }

    @ApiOperation({summary: "This action is only done by the admin user and the cart owner"})
    @Delete(':cartOwnerEmail')
    @ApiParam({name:'cartOwnerEmail', description: "Removes item or clears the user's cart by email", required: true}) // Param doc for Swagger
    @ApiImplicitQueries([
        { name: "carId", description: "gets the ID of the item that is to be removed", required: false}
    ])
    @UseGuards(JwtAuthGuard)
    clearCartOrRemoveFromCart (@Param('cartOwnerEmail') cartOwnerEmail: string, @Query('carId') carId: string, @Request() request) {
        const user = request.user
        // if carId is given as a query parameter
        if(carId) {
            return this.cartService.removeFromCart(cartOwnerEmail, parseInt(carId), user);
        }
        return this.cartService.clearCart(cartOwnerEmail, user)
    }

}
