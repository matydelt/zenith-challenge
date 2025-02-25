import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './models/order.model';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { MessageBrokerService } from 'src/common/message-broker/messageBroker.service';
import { CacheService } from 'src/common/cache/cache.service';
import { LogsService } from '../logs/logs.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
  ],
  controllers: [OrderController],
  providers: [OrderService, MessageBrokerService, CacheService, LogsService],
})
export class OrderModule {}
