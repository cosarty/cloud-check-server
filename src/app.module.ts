import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AllExceptionsFilter } from './common/filter/http.exception';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import jwtConf from './config/jwt.conf';
import { LoginModule } from './login/login.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ResponseInterceptor } from './common/interceptor/response.interceptor';

@Module({
  imports: [
    LoginModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [jwtConf],
    }),

    // 限流
    ThrottlerModule.forRoot({
      //每60秒
      ttl: 10,
      //限制接口访问10次
      limit: 10,
    }),
  ],
  controllers: [AppController],
  providers: [
    {
      // 全局异常过滤器
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      // 全局限流守卫
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
