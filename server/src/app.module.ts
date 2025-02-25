import { Module } from '@nestjs/common';
import { LogsModule } from './modules/logs/logs.module';
import { ConfigModule } from './config/config.module';
import { OrderModule } from './modules/orders/order.module';
import { CacheCustomModule } from './common/cache/cache.module';

@Module({
  imports: [CacheCustomModule, LogsModule, OrderModule, ConfigModule],
})
export class AppModule {}
