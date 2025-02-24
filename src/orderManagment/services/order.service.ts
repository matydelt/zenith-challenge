import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Order } from '../models/order.model';
import OrderDto from '../dtos/order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CustomLogger } from 'src/common/logger.service';

@Injectable()
export class OrderService {
  private readonly logger = new CustomLogger(OrderService.name);

  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
  ) {}

  async createOrder(order: OrderDto): Promise<Order> {
    const products = order.products.map((product) => {
      return {
        productId: product.productId,
        quantity: product.quantity,
      };
    });
    order.products = products;
    const newOrder = new this.orderModel(order);
    return newOrder.save();
  }

  async getOrderById(orderId: string): Promise<any> {
    const order = await this.orderModel.findById(orderId).exec();
    if (!order) {
      throw new HttpException('Order not available', HttpStatus.NOT_FOUND);
    }
    return order;
  }

  buildOrderResponse(order: Order): any {
    return {
      orderId: order._id,
      userId: order.userId,
      products: order.products,
      status: order.status,
    };
  }
}
