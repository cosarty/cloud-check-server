import { registerAs, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
export default registerAs('email', () => {
  return {
    transport: {
      service: 'qq',
      port: 465,
      secureConnection: true,
      host: 'smtp.qq.com',
      auth: {
        user: process.env.MAILDEV_INCOMING_USER,
        pass: process.env.MAILDEV_INCOMING_PASS,
      },
    }, // 邮件地址
    defaults: {
      form: `"空模板" ${process.env.MAILDEV_INCOMING_USER}`, // 默认地址
    },
    template: {
      dir: join(process.cwd(), 'dist', 'template/email'),
      adapter: new EjsAdapter(),
      // 不需要严格模式 要不然获取数据就需要locals.变量名
      options: {
        strict: false,
      },
    },
  };
});
