import { Module } from '@nestjs/common';
import { OrderController } from './controllers/order.controller';
import { OrderService } from './services/order.service';
import { RabbitmqProvider } from 'src/common/rabbitMq.provider';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './models/order.model';
import { RedisService } from 'src/common/redis.service';
import { LogService } from './services/log.service';
import { LogsController } from './controllers/logs.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
  ],
  controllers: [OrderController, LogsController],
  providers: [OrderService, RabbitmqProvider, RedisService, LogService],
})
export class OrderManagmentModule {}
