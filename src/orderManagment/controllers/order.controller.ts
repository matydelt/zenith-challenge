/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import OrderDto from '../dtos/order.dto';
import { OrderService } from '../services/order.service';
import { RabbitmqProvider } from 'src/common/rabbitMq.provider';
import { CacheInterceptor } from 'src/interceptors/cache.interceptor';
import { RedisService } from 'src/common/redis.service';
import { CustomLogger } from 'src/common/logger.service';

@Controller('orders')
export class OrderController {
  private readonly logger = new CustomLogger(OrderController.name);

  constructor(
    private readonly orderService: OrderService,
    private readonly rabbitProvider: RabbitmqProvider,
    private readonly redisService: RedisService,
  ) {}

  @Post('')
  async createOrder(@Body() order: OrderDto): Promise<any> {
    try {
      const newOrder = await this.orderService.createOrder(order);
      this.logger.registerOrderLog(
        `Order ${String(newOrder._id)} created for user: ${order.userId}`,
        String(newOrder._id),
      );

      this.rabbitProvider.sendMessage(newOrder._id as string);
      return {
        orderId: newOrder.id,
        status: newOrder.status,
      };
    } catch (error) {
      this.logger.error(error);
    }
  }

  @UseInterceptors(CacheInterceptor)
  @Get(':orderId')
  async getOrderById(@Param('orderId') orderId: string): Promise<any> {
    try {
      const data = await this.orderService.getOrderById(orderId);
      const result = this.orderService.buildOrderResponse(data);

      await this.redisService.set(`/orders/${orderId}`, result);
      return result;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
