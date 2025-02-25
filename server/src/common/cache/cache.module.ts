/* eslint-disable @typescript-eslint/require-await */
import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { CacheService } from './cache.service';
import { createKeyv } from '@keyv/redis';

const cacheModuleFactory = CacheModule.registerAsync({
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
  imports: [cacheModuleFactory],
  controllers: [],
  providers: [CacheService],
  exports: [CacheService, CacheModule],
})
export class CacheCustomModule {}
