/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import {
  Body,
  ConsoleLogger,
  Controller,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { CacheInterceptor } from 'src/common/interceptors/cache.interceptor';
import OrderDto from './dtos/order.dto';
import { OrderService } from './order.service';
import { MessageBrokerService } from 'src/common/message-broker/messageBroker.service';
import { LogsService } from '../logs/logs.service';
import { ObjectIdPipe } from 'src/common/pipes/objectid.pipe';

@Controller('orders')
export class OrderController {
  private readonly logger = new ConsoleLogger(OrderController.name);

  constructor(
    private readonly orderService: OrderService,
    private readonly messageBrokerService: MessageBrokerService,
    private readonly logsService: LogsService,
  ) {}

  @Post('')
  async createOrder(@Body() order: OrderDto): Promise<any> {
    try {
      const newOrder = await this.orderService.createOrder(order);
      this.logsService.registerOrderLog(
        `Order ${String(newOrder._id)} created for user: ${order.userId}`,
        String(newOrder._id),
      );

      this.messageBrokerService.sendMessage(newOrder._id as string);
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
  async getOrderById(@Param('orderId', ObjectIdPipe) orderId: string): Promise<any> {
    try {
      const data = await this.orderService.getOrderById(orderId);
      return this.orderService.buildOrderResponse(data);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
