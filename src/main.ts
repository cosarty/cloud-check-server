import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ValidatePipe } from './common/pipe/validate.pipe';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api', {
    //排除/路由
    exclude: ['/'],
  });

  // 自定义验证守卫守卫
  // app.useGlobalPipes(new ValidationPipe({ whitelist: false,, transform: true }));
  app.useGlobalPipes(new ValidatePipe({ whitelist: false }));
  await app.listen(3000);
}
bootstrap();
