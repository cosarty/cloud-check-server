import { BaseData } from '@/types';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const res = context.switchToHttp().getResponse() as Response;
    return next.handle().pipe(
      map((r) => {
        const base = {
          success: true,
          timestamp: new Date(),
          code: res.statusCode,
          message: undefined,
          data: null,
        };

        if (typeof r === 'object' && r !== null) {
          const { message, data } = r;
          if (!message) Object.assign(base, { data: r });
          if (message) Object.assign(base, { message });
          if (message && data) Object.assign(base, { data });

          return base;
        }

        return Object.assign(base);
      }),
    );
  }
}
