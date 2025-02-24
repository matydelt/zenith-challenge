/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { RedisService } from 'src/common/redis.service';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  constructor(private redisService: RedisService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const uri = context.switchToHttp().getRequest().url;
    const data = await this.redisService.get(uri); // Error occurs here
    if (data) {
      return of(data);
    }

    return next.handle().pipe(
      tap((response) => {
        this.redisService.set(uri, response);
        console.log('Data cached for key:', uri);
      }),
    );
  }
}
