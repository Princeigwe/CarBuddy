import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import {Cart, CartDocument, Product, ProductDocument} from './cart.schema'
import {Model} from 'mongoose'
import { InjectModel } from '@nestjs/mongoose';
import { CreateProductDto } from './dtos/createProduct.dto';
import {CarsService } from '../cars/services/cars.service'

@Injectable()
export class CartService {
    constructor(
        @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
        @InjectModel(Product.name) private productModel: Model<ProductDocument>,
        private carsService: CarsService
    ) {}

    async createCart(cartOwnerEmail: string) {
        const cart = new this.cartModel(cartOwnerEmail)
        return cart.save()
    }

    async getCarts() {
        const carts = await this.cartModel.find()
        return carts
    }

    async getCartByEmail(cartOwnerEmail: string) {
        const cart = await this.cartModel.findOne({cartOwnerEmail: cartOwnerEmail}).exec()
        return cart
    }

    // 'id' here is the id of the car that will be added to the cart
    async addToCart(cartOwnerEmail: string, id: number, quantity: number) {

        const car = await this.carsService.getPublicCarByIdForCart(id)
        const totalPrice = car.estimatedPrice * quantity

        // TODO: to check if the item to be added is already in the cart
        //? there's probably a better way to write this

        const itemExists = await this.cartModel.findOne({
            cartOwnerEmail: cartOwnerEmail, 

            'items.style': car.style,
            'items.releaseYear': car.releaseYear,
            'items.brand': car.brand,
            'items.model': car.model,
            'items.useType': car.useType,
            'items.estimatedPrice': car.estimatedPrice,
            'items.mileage': car.mileage,
            'items.location': car.location,
            'items.exteriorColour': car.exteriorColour,
            'items.interiorColour': car.interiorColour,
            'items.milesPerGallon': car.milesPerGallon,
            'items.engine': car.engine,
            'items.driveType': car.driveType,
            'items.fuelType': car.fuelType,
            'items.transmissionType': car.transmissionType,
            'items.dealer': car.dealer,
            'items.extraFeature': car.extraFeature,

        })

        // if the item exists in the items list, increment the item quantity and total price, and the cart total Price
        if (itemExists){

            // the price change that will reflect in an item if it exists already
            let addNewPrice = car.estimatedPrice * quantity 

            await this.cartModel.updateOne({
                cartOwnerEmail: cartOwnerEmail, 

                'items.carId': car.id,
                'items.style': car.style,
                'items.releaseYear': car.releaseYear,
                'items.brand': car.brand,
                'items.model': car.model,
                'items.useType': car.useType,
                'items.estimatedPrice': car.estimatedPrice,
                'items.mileage': car.mileage,
                'items.location': car.location,
                'items.exteriorColour': car.exteriorColour,
                'items.interiorColour': car.interiorColour,
                'items.milesPerGallon': car.milesPerGallon,
                'items.engine': car.engine,
                'items.driveType': car.driveType,
                'items.fuelType': car.fuelType,
                'items.transmissionType': car.transmissionType,
                'items.dealer': car.dealer,
                'items.extraFeature': car.extraFeature,
    
            }, {
                $inc: { 'items.$[].quantity': quantity, 'items.$[].totalPrice': addNewPrice, finalTotal: addNewPrice }
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
            let finalTotal = prices.reduce( (accumulate,current) => accumulate + current, 0 ) // cart final Total price
    
            // setting finalTotal  field to finalTotal
            await this.cartModel.updateOne( {'cartOwnerEmail': cartOwnerEmail}, { $set: {finalTotal: finalTotal} })

        }

    }

    // 'id' here is the id of the car that will be added to the cart
    async removeFromCart( cartOwnerEmail: string, carId: number) {

        const userCart = await this.cartModel.findOne({cartOwnerEmail: cartOwnerEmail}).exec()

        const cartItems = userCart.items
        console.log(cartItems)
        
        // getting the item that has carId parameter value as the value of 'carId' field.
        let item = cartItems.find(item => item['carId'] === carId)
        
        let priceToReduct = item['totalPrice']
        console.log(priceToReduct)

        // update the cart by removing the item from the cart items list, and reduct the item price from the cart total price
        await this.cartModel.updateOne({cartOwnerEmail: cartOwnerEmail}, { $inc: { finalTotal: -priceToReduct }, $pull: { items: { carId: carId } } })
    }


    // TODO: this area should be available to the admin only
    async deleteCarts() {
        await this.cartModel.deleteMany();
        return new HttpException('Carts Deleted', HttpStatus.GONE)
    }
}
