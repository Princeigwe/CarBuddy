import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {Repository} from 'typeorm'
import {Order} from './models/order.entity'
import {OrderItem} from './models/orderItem.entity'
import {User} from '../users/user.entity'
import {CartService} from '../cart/cart.service'
import {UsersService} from '../users/users.service'
import { EventEmitter2 } from '@nestjs/event-emitter';
import {OrderCreatedEvent} from '../events/order.created.event'
import {CaslAbilityFactory} from '../casl/casl-ability.factory'
import {Action} from '../enums/action.enum'

import {transporter} from 'src/nodemailer/transporter'

@Injectable()
export class OrdersService {

    constructor( 
        @InjectRepository(Order) private orderRepo: Repository<Order>, 
        @InjectRepository(OrderItem) private orderItemRepo: Repository<OrderItem>,
        private cartService: CartService,
        private usersService: UsersService, 
        private eventEmitter: EventEmitter2,
        private caslAbilityFactory: CaslAbilityFactory,
    ) {}

    // this function will get the cart Items in the user cart, in order to create an order
    /**
     * The function creates an order for the current user, and then creates an order item for each item
     * in the user's cart
     * @param {User} user - User - this is the current user object
     * @returns The order object is being returned.
     */
    async createOrder (user: User) {
        const currentUser = await this.usersService.findOne( { where: {id: user.id}, relations: ['profile'] } )
        const userEmail = user.email
        const userProfile = currentUser.profile

        // getting the cart of the current user
        const userCart = await this.cartService.getCartByEmail(userEmail, user)


        const buyer = `${userProfile.firstName} ${userProfile.lastName}`
        const buyerContact = userProfile.telephone
        const buyerEmail = user.email

        // for total price of the order
        const totalPrice = userCart['finalTotal']

        const order = this.orderRepo.create({buyer, buyerContact, buyerEmail, totalPrice})
        const savedOrder = await this.orderRepo.save(order)

        for(var item of userCart.items) {
            const vehicleType = item['style']
            const releaseYear = item['releaseYear']
            const brand = item['brand']
            const model = item['model']
            const quantity = item['quantity']
            const useType = item['useType']
            const estimatedPrice = item['estimatedPrice']
            const mileage = item['mileage']
            const location = item['location']
            const exteriorColour = item['exteriorColour']
            const interiorColour = item['interiorColour']
            const milesPerGallon = item['milesPerGallon']
            const engine = item['engine']
            const driveType = item['driveType']
            const fuelType = item['fuelType']
            const transmissionType = item['transmissionType']
            const price = item['totalPrice']

            // getting the item dealer object
            const itemDealerObject = item['dealer']

            // to get the profile of the dealer
            const dealerObject = await this.usersService.findOne( { where: {id: itemDealerObject['id']}, relations: ['profile'] } )
            const dealerProfile = dealerObject.profile

            // this is done in order to get the first and last name of the dealer
            const dealerNames = `${dealerProfile['firstName']} ${dealerProfile['lastName']}`

            const dealer = dealerNames
            const dealer_contact = dealerProfile.telephone
            const dealer_email = dealerObject.email

            const orderItem = this.orderItemRepo.create({
                order,
                vehicleType,
                releaseYear,
                brand,
                model,
                quantity,
                useType,
                estimatedPrice,
                mileage,
                location,
                exteriorColour,
                interiorColour,
                milesPerGallon,
                engine,
                driveType,
                fuelType,
                transmissionType,
                price,
                dealer,
                dealer_contact,
                dealer_email
            })
            
            await this.orderItemRepo.save(orderItem)

            // emitting an event to delete user cart items when order is created
            this.eventEmitter.emit('order.created', new OrderCreatedEvent(userEmail))
        }

        // after order is created and saved, send email notifying the user that the order has been created
        let mailOptions = {
            from: process.env.GMAIL_USER,
            to: `${userEmail}`,
            subject: 'Order created',
            text: `This is notify you that the owner this email, ${userEmail}, has successfully created an order from Car Buddy.`
        }

        await transporter.sendMail(mailOptions, function(err, info) {
            if (err) {
                console.error(err);
            }else {
                console.log('Message sent: ' + info.response)
            }
                transporter.close()
        })

        return savedOrder
    }


    // this action should for admin users and the owner of the order created
    async getOrders () {
        return this.orderRepo.find()
    }


    // this is meant only for the owner of the orders
    async getOrdersByUserEmail (user: User) {
        const orders =  await this.orderRepo.find({ where: {buyerEmail: user.email}})
        return orders
    }


    async getOrderById (id: number, user: User) {
        const ability = await this.caslAbilityFactory.createForUser(user)
        const order = await this.orderRepo.findOne({ where: {id: id}, relations: ['items']})
        if (!order) {
            throw new NotFoundException( `Order with ${id} not found` )
        }
        if ( order.buyerEmail === user.email || ability.can(Action.Manage, order) ) {
            return order
        }else{
            throw new HttpException('Forbidden Response', HttpStatus.FORBIDDEN)
        }
    }


    // this action should be only for admin users
    async deleteOrders () {
        await this.orderRepo.delete({})
        return new HttpException('Orders Deleted', HttpStatus.GONE)
    }


    // this action should be only for admin users
    async deleteOrderById (id: number) {
        const order = await this.orderRepo.findOne(id)
        if (!order) { 
            throw new NotFoundException( `Order with ${id} not found` )
        }
        await this.orderRepo.delete(order)
        return new HttpException('Order Deleted', HttpStatus.GONE)
    }
}
