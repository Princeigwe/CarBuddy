import { Controller, Post, Request, UseGuards, Get, Param, Delete } from '@nestjs/common';
import {OrdersService} from '../orders/orders.service'
import {JwtAuthGuard} from '../auth/jwt-auth.guard'
import { Roles } from '../roles.decorator';
import { RolesGuard } from '../roles.guards';
import {Role} from '../enums/role.enum'

@Controller('orders')
export class OrdersController {
    constructor(private ordersService: OrdersService) {}

    @Post()
    @UseGuards(JwtAuthGuard)
    createOrder(@Request() request ) {
        const user = request.user
        return this.ordersService.createOrder(user)
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    @Roles(Role.Admin)
    getOrders() {
        return this.ordersService.getOrders()
    }

    @Get('email')
    @UseGuards(JwtAuthGuard)
    getOrdersByUserEmail(@Request() request) {
        const user = request.user
        return this.ordersService.getOrdersByUserEmail(user)
    }


    @Get(':id')
    getOrderById(@Param('id') id: string) {
        // return this.ordersService.getOrderById(parseInt(id))
    }

    @Delete()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    deleteOrders() {
        return this.ordersService.deleteOrders()
    }
}
