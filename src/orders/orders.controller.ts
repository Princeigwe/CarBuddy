import { Controller, Post, Request, UseGuards, Get, Param, Delete, UseInterceptors, CacheInterceptor } from '@nestjs/common';
import {OrdersService} from '../orders/orders.service'
import {JwtAuthGuard} from '../auth/jwt-auth.guard'
import { Roles } from '../roles.decorator';
import { RolesGuard } from '../roles.guards';
import {Role} from '../enums/role.enum'
import { ApiParam, ApiTags, ApiOperation } from '@nestjs/swagger';

import {transporter} from 'src/nodemailer/transporter'


@Controller('orders')
@ApiTags("Orders")
export class OrdersController {
    constructor(private ordersService: OrdersService) {}

    @Post()
    @UseGuards(JwtAuthGuard)
    async createOrder(@Request() request ) {
        const user = request.user

        let mailOptions = {
            to: "igwep297@gmail.com",
            from: 'CarBuddyOrg@gmail.com',
            subject: 'Order created',
            text: 'Order created'
        }

        console.log(mailOptions.to)
        await transporter.sendMail(mailOptions)
        return this.ordersService.createOrder(user)
    }

    @ApiOperation({summary: "This action is only done by the admin user"})
    @Get()
    @UseInterceptors(CacheInterceptor)
    @UseGuards(JwtAuthGuard)
    @Roles(Role.Admin)
    getOrders() {
        return this.ordersService.getOrders()
    }

    @ApiOperation({summary: "This action is only done by the admin user and owner of the order"})
    @Get('email')
    @UseGuards(JwtAuthGuard)
    getOrdersByUserEmail(@Request() request) {
        const user = request.user
        return this.ordersService.getOrdersByUserEmail(user)
    }


    @ApiOperation({summary: "This action is only done by the admin user and owner of the order"})
    @Get(':id')
    @UseGuards(JwtAuthGuard)
    getOrderById(@Param('id') id: string, @Request() request) {
        const user = request.user
        return this.ordersService.getOrderById(parseInt(id), user)
    }

    @ApiOperation({summary: "This action is only done by the admin user and owner of the order"})
    @Delete()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    deleteOrders() {
        return this.ordersService.deleteOrders()
    }
}
