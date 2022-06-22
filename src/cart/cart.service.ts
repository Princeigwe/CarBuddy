import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import {Cart, CartDocument} from './cart.schema'
import {Model} from 'mongoose'
import { InjectModel } from '@nestjs/mongoose';
import {CarsService } from '../cars/services/cars.service'
import {OnEvent} from '@nestjs/event-emitter'
import {UserRegisteredEvent} from '../events/user.registered.event'
import {UserDeletedEvent} from '../events/user.deleted.event'
import { OrderCreatedEvent } from '../events/order.created.event';
import {User} from '../users/user.entity'
import {Role} from '../enums/role.enum'
import {CaslAbilityFactory} from '../casl/casl-ability.factory'
import {Action} from '../enums/action.enum'

// import DynamoDB defined methods
import { createCart } from '../aws/cartDynamoDB/createCart';



@Injectable()
export class CartService {
    constructor(
        @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
        private carsService: CarsService,
        private caslAbilityFactory: CaslAbilityFactory

    ) {}


    // creating user cart with cartOwnerEmail by listening to the event, user.registered
    /* This is a method that listens to the event, user.registered, and creates a cart for the user that
   just registered. */
    @OnEvent('user.registered')
    async createCartEvent(payload: UserRegisteredEvent) {
        let cartOwnerEmail = payload.email
        
        // if the running node environment is production... create new cart Document on DynamoDB
        if(process.env.NODE_ENV == 'production') {
            createCart(cartOwnerEmail)
        }else{
            const cart = new this.cartModel({cartOwnerEmail})
            return cart.save()
        }
    }

    // this action is available to the admin only
    /**
     * It returns a promise that resolves to an array of all the carts in the database
     * @returns An array of all the carts in the database.
     */
    async getCarts() {
        const carts = await this.cartModel.find()
        return carts
    }


    /**
     * The function gets a cart by email, and if the cart exists, it checks if the user has the ability
     * to manage the cart. If the user has the ability to manage the cart, the function returns the
     * cart. If the user does not have the ability to manage the cart, the function throws a forbidden
     * response
     * @param {string} cartOwnerEmail - string - the email of the user who owns the cart
     * @param {User} user - User - this is the user object that is passed in from the controller.
     * @returns The cart object is being returned.
     */
    async getCartByEmail(cartOwnerEmail: string, user: User) {
        const cart = await this.cartModel.findOne({cartOwnerEmail: cartOwnerEmail}).exec()
        if (!cart) { throw new NotFoundException('Cart Not Found') }
        
        const ability = this.caslAbilityFactory.createForUser(user)

        // AUTHORIZATION
        if( JSON.stringify(cart.cartOwnerEmail) == JSON.stringify(user.email) ||  ability.can(Action.Manage, cart) ) {
            return cart
        }
        else {
            throw new HttpException('Forbidden Response', HttpStatus.FORBIDDEN)
        }
    }


    // 'id' here is the id of the car that will be added to the cart
    /**
     * The function adds an item to the cart, and if the item already exists in the cart, it increments
     * the item quantity and total price, and the cart total Price
     * @param {string} cartOwnerEmail - the email of the user who owns the cart
     * @param {number} id - the id of the car to be added to the cart
     * @param {number} quantity - number,
     * @param {User} user - User is the user that is currently logged in
     */
    async addToCart(cartOwnerEmail: string, id: number, quantity: number, user: User) {

        const car = await this.carsService.getPublicCarByIdForCart(id)
        const totalPrice = car.estimatedPrice * quantity

        const userCart = await this.cartModel.findOne({cartOwnerEmail: cartOwnerEmail})

        // AUTHORIZATION
        if(JSON.stringify(user.email) !== JSON.stringify(userCart.cartOwnerEmail)) {
            throw new HttpException('Forbidden Response', HttpStatus.FORBIDDEN)
        }

        // TODO: to check if the item to be added is already in the cart
        //? there's probably a better way to write this

        const itemExists = await this.cartModel.findOne({
            cartOwnerEmail: cartOwnerEmail, 
            'items.carId': car.id,
        })

        // if the item exists in the items list, increment the item quantity and total price, and the cart total Price
        if (itemExists){

            // the price change that will reflect in an item if it exists already
            let addNewPrice = car.estimatedPrice * quantity 

            await this.cartModel.updateOne({
                cartOwnerEmail: cartOwnerEmail, 
                'items.carId': car.id,
            }, {
                $inc: { 'items.$.quantity': quantity, 'items.$.totalPrice': addNewPrice, finalTotal: addNewPrice }
            })
        }

        // if the item doesn't exist, add it to the item'
        else {

            const product = {
                carId: car.id,
                style: car.style,
                releaseYear: car.releaseYear,
                brand: car.brand,
                model: car.model,
                useType: car.useType,
                estimatedPrice: car.estimatedPrice,
                mileage: car.mileage,
                location: car.location,
                exteriorColour: car.exteriorColour,
                interiorColour: car.interiorColour,
                milesPerGallon: car.milesPerGallon,
                engine: car.engine,
                driveType: car.driveType,
                fuelType: car.fuelType,
                transmissionType: car.transmissionType,
                dealer: car.dealer,
                extraFeature: car.extraFeature,
                quantity: quantity,
                totalPrice: totalPrice,
            }
    
            // adding the item to the cart items array
            await this.cartModel.updateOne( {'cartOwnerEmail': cartOwnerEmail}, { $push: {items: product} })
    
    
            // returning only value of the items key
            let cart = await this.cartModel.findOne( { 'cartOwnerEmail': cartOwnerEmail } )
    
            let prices: number[] = []
    
            for (var item of cart.items) {
                prices.push(item['totalPrice'])
            }
    
            // summing items in the prices array with TypeScript reduce method
            let finalTotal = prices.reduce( (accumulate, current) => accumulate + current, 0 ) // cart final Total price
    
            // setting finalTotal  field to finalTotal
            await this.cartModel.updateOne( {'cartOwnerEmail': cartOwnerEmail}, { $set: {finalTotal: finalTotal} })
        }
    }


    // 'id' here is the id of the car that will be added to the cart
    /**
     * It removes an item from the cart items list, and reduct the item price from the cart total price
     * @param {string} cartOwnerEmail - the email of the user who owns the cart.
     * @param {number} carId - number,
     * @param {User} user - User is the user object that is passed from the controller.
     */
    async removeFromCart( cartOwnerEmail: string, carId: number, user: User) {

        const userCart = await this.cartModel.findOne({cartOwnerEmail: cartOwnerEmail}).exec()
        const cartItems = userCart.items

        // AUTHORIZATION
        if(JSON.stringify(user.email) !== JSON.stringify(userCart.cartOwnerEmail) ) {
            throw new HttpException('Forbidden Response', HttpStatus.FORBIDDEN)
        }
        
        // getting the item that has carId parameter value as the value of 'carId' field.
        let item = cartItems.find(item => item['carId'] === carId)
        
        let priceToReduct = item['totalPrice']

        // update the cart by removing the item from the cart items list, and reduct the item price from the cart total price
        await this.cartModel.updateOne({cartOwnerEmail: cartOwnerEmail}, { $inc: { finalTotal: -priceToReduct }, $pull: { items: { carId: carId } } })
    }


    // method to clear all items from the cart
    /**
     * This function clears the cart of the user who is logged in
     * @param {string} cartOwnerEmail - string - the email of the user who owns the cart
     * @param {User} user - User - this is the user that is currently logged in.
     */
    async clearCart(cartOwnerEmail: string, user: User) {

        const userCart = await this.cartModel.findOne({cartOwnerEmail: cartOwnerEmail}).exec()

        // AUTHORIZATION
        if(JSON.stringify(user.email) !== JSON.stringify(userCart.cartOwnerEmail) ) {
            throw new HttpException('Forbidden Response', HttpStatus.FORBIDDEN)
        }

        await this.cartModel.updateOne({cartOwnerEmail: cartOwnerEmail}, { $pull: { items: {  } }, $set: { finalTotal: 0 } })
    }


    // event to clear user cart after order has been created
    @OnEvent('order.created')
    async orderCreatedClearCart(payload: OrderCreatedEvent) {
        const cartOwnerEmail = payload.email
        await this.cartModel.updateOne({cartOwnerEmail: cartOwnerEmail}, { $pull: { items: {  } }, $set: { finalTotal: 0 } })
    }

    // this will be executed when a user is deleted, by an event
    /* Listening to the event, user.deleted, and deleting the cart of the user that was deleted. */
    @OnEvent('user.deleted')
    async deleteCart(payload: UserDeletedEvent) {
        let cartOwnerEmail = payload.email
        await this.cartModel.deleteOne({cartOwnerEmail: cartOwnerEmail})
    }

    // this action is available to the admin only
    /**
     * It deletes all the carts in the database
     * @returns A promise
     */
    async deleteCarts() {
        await this.cartModel.deleteMany();
        return new HttpException('Carts Deleted', HttpStatus.GONE)
    }
}
