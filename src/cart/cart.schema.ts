import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as mongoose from 'mongoose';

export type ProductDocument = Product & Document

@Schema()
export class Product {

    @Prop({required: true})
    productName: string;

    @Prop({required: true})
    quantity: number;

    @Prop({required: true})
    price: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

export type CartDocument = Cart & Document;

@Schema() 
export class Cart {

    @Prop()
    cartOwnerEmail: string;

    @Prop({ type: mongoose.Schema.Types.Array })
    items: [];

    @Prop()
    finalTotal: number;

}

export const CartSchema = SchemaFactory.createForClass(Cart)