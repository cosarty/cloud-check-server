import { ClassModule } from './module/class/class.module';
import { SequelizeModule } from './util/global/sequelize.module';
import { StrategyModule } from './util/global/strategy.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AllExceptionsFilter } from './common/filter/http.exception';
import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import * as config from './config';
import { LoginModule } from './module/login/login.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ResponseInterceptor } from './common/interceptor/response.interceptor';
import { MailerModule } from '@nest-modules/mailer';

@Module({
  imports: [
    ClassModule,
    SequelizeModule,
    StrategyModule,
    LoginModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [...Object.values(config)],
    }),
    MailerModule.forRootAsync({
      useFactory: (config: ConfigService) => config.get('email'),
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    // 限流
    ThrottlerModule.forRoot({
      //每60秒
      ttl: 10,
      //限制接口访问10次
      limit: 10,
    }),
    CacheModule.register({ isGlobal: true }),
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
