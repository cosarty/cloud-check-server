import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

import * as session from 'express-session';

import { ValidatePipe } from './common/pipe/validate.pipe';
import { join } from 'path';
import uploadConf, { UploadConfType } from '@/config/upload.conf';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api', {
    // 排除/路由
    exclude: ['/'],
  });

  // 自定义验证守卫守卫
  // app.useGlobalPipes(new ValidationPipe({ whitelist: false,, transform: true }));
  app.useGlobalPipes(new ValidatePipe({ whitelist: false }));

  // 动态注入静态目录
  for (const k in uploadConf().base) {
    const value = uploadConf().base[k] as any;
    app.useStaticAssets(
      join(__dirname, '..', uploadConf().root, value.private),
      { prefix: value.public },
    );
  }

  app.use(
    session({
      secret: 'dianxiton',
      name: 'captchaId',
      rolling: true,
      cookie: { maxAge: null },
    }),
  );
  await app.listen(3030);
}
bootstrap();
