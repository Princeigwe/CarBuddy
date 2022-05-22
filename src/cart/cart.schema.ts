import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export type ProductDocument = Product & Document

@Schema()
export class Product {

    @Prop()
    productName: string;

    @Prop({default: 1})
    quantity: number;

    @Prop()
    price: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

export type CartDocument = Cart & Document;

@Schema() 
export class Cart {

    @Prop()
    cartOwnerEmail: string;

    // @Prop( {type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }] } )
    // items: Product[];

    @Prop( { type: mongoose.Schema.Types.Array} )
    items: Product[];

}

export const CartSchema = SchemaFactory.createForClass(Cart)