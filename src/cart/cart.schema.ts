import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as mongoose from 'mongoose';


export type CartDocument = Cart & Document;

@Schema() 
export class Cart {

    @Prop()
    cartOwnerEmail: string;

    @Prop({ type: mongoose.Schema.Types.Array })
    items: [];

    @Prop({default: 0})
    finalTotal: number;

}

export const CartSchema = SchemaFactory.createForClass(Cart)