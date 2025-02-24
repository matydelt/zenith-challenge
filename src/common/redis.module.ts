/* eslint-disable @typescript-eslint/require-await */
import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisService } from './redis.service';
import { createKeyv } from '@keyv/redis';

const redisModuleFactory = CacheModule.registerAsync({
  isGlobal: true,
  useFactory: async () => {
    return {
      stores: [
        createKeyv({
          socket: {
            host: process.env.REDIS_HOST,
            port: Number(process.env.REDIS_PORT),
          },
        }),
      ],
    };
  },
});

@Module({
  imports: [redisModuleFactory],
  controllers: [],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
