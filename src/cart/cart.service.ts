import { Injectable } from '@nestjs/common';
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

    // async addToCart(cartOwnerEmail: string, createProduct: CreateProductDto): Promise<any> {
    //     const cart = this.cartModel.updateOne( {'cartOwnerEmail': cartOwnerEmail}, { $push: {items: createProduct} })
    //     console.log(cart)
    //     return cart
    // }

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
        await this.cartModel.updateOne( {'cartOwnerEmail': cartOwnerEmail}, { $push: {items: product} })
        return await this.getCartByEmail(cartOwnerEmail)
    }

    async deleteCarts() {
        await this.cartModel.remove();
    }
}
