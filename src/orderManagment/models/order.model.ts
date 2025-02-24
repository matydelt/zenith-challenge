import mongoose, { HydratedDocument } from 'mongoose';
import { Product } from './product.model';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type OrderDocument = HydratedDocument<Order>;

@Schema()
export class Order extends mongoose.Document {
  @Prop({ required: false })
  userId: string;
  @Prop({ required: false, type: Array<Product> })
  products: Product[];
  @Prop({
    required: false,
    enum: ['PROCESSING', 'COMPLETED', 'FAILED'],
    default: 'PROCESSING',
  })
  status: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
