import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {Repository} from 'typeorm'
import {Order} from './models/order.entity'
import {OrderItem} from './models/orderItem.entity'
import {User} from '../users/user.entity'
import {CartService} from '../cart/cart.service'
import {ProfilesService} from '../profiles/profiles.service'
import {UsersService} from '../users/users.service'


@Injectable()
export class OrdersService {

    constructor( 
        @InjectRepository(Order) private orderRepo: Repository<Order>, 
        @InjectRepository(OrderItem) private orderItemRepo: Repository<OrderItem>,
        private profilesService: ProfilesService,
        private cartService: CartService,
        private usersService: UsersService
    ) {}


    // this function will get the cart Items in the user cart, in order to create an order
    async createOrder (user: User) {
        const currentUser = await this.usersService.findOne( { where: {id: user.id}, relations: ['profile'] } )
        const userEmail = user.email
        // const userProfile = user["profile"] // says undefined
        const userProfile = currentUser.profile
        console.log(userProfile)

        console.log(user.id)

        const userCart = await this.cartService.getCartByEmail(userEmail, user)
        // const buyer = `${userProfile.firstName} ${userProfile.lastName}`
    }


    async getOrders () {}


    async getOrderById () {}


    async deleteOrders () {}


    async deleteOrderById () {}
}
