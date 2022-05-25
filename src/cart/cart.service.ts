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

    async addToCart(cartOwnerEmail: string, id: number, quantity: number) {
        const car = await this.carsService.getPublicCarByIdForCart(id)
        const totalPrice = car.estimatedPrice * quantity

        const product = {
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


    // TODO: this area should be available to the admin only
    async deleteCarts() {
        await this.cartModel.remove();
        return new HttpException('Carts Deleted', HttpStatus.GONE)
    }
}
