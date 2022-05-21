import { Injectable } from '@nestjs/common';
import {Cart, CartDocument, Product, ProductDocument} from './cart.schema'
import {Model} from 'mongoose'
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CartService {
    constructor(
        @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
        @InjectModel(Product.name) private productModel: Model<ProductDocument>,

    ) {}

    async createCart(cartOwnerEmail: string) {
        const cart = new this.cartModel(cartOwnerEmail)
        return cart.save()
    }

    async getCarts() {
        const carts = await this.cartModel.find()
        return carts
    }

    async addToCart(cartOwnerEmail: string, productName: string, quantity: number, price: number): Promise<any> {
        const product = new this.productModel({productName, quantity, price})
        const cart = this.cartModel.updateOne( {'cartOwnerEmail': cartOwnerEmail}, { $push: {items: product} })
        return cart
    }

    async deleteCarts() {
        await this.cartModel.remove();
    }
}
