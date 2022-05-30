import { Controller, Post, Request, UseGuards, Get, Param } from '@nestjs/common';
import {OrdersService} from '../orders/orders.service'
import {JwtAuthGuard} from '../auth/jwt-auth.guard'

@Controller('orders')
export class OrdersController {
    constructor(private ordersService: OrdersService) {}

    @Post()
    @UseGuards(JwtAuthGuard)
    createOrder(@Request() request ) {
        const user = request.user
        return this.ordersService.createOrder(user)
    }

    @Get(':id')
    getOrderById(@Param('id') id: string) {
        return this.ordersService.getOrderById(parseInt(id))
    }
}
