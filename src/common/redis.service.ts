import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async set(key: string, value: unknown) {
    try {
      return await this.cacheManager.set(key, value);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async get(key: string) {
    try {
      const jsonData: string | null | undefined =
        await this.cacheManager.get(key);
      return jsonData;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
