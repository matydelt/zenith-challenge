import { Module } from '@nestjs/common';

import { OrderManagmentModule } from './orderManagment/orderManagment.module';
import { MongooseModule } from '@nestjs/mongoose';
import { RedisModule } from './common/redis.module';

@Module({
  imports: [
    RedisModule,
    OrderManagmentModule,
    MongooseModule.forRoot(
      process.env.MONGO_URI || 'mongodb://localhost/zenith',
    ),
  ],
})
export class AppModule {}
