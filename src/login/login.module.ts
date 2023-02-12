import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from '@/common/strategy/jwt.strategy';
import { MailerModule } from '@nest-modules/mailer';
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory(config: ConfigService) {
        return {
          //设置加密使用的 secret
          secret: config.get('app.token_secret'),

          //过期时间
          signOptions: { expiresIn: '30d' },
        };
      },
    }),
    MailerModule.forRootAsync({
      useFactory: (config: ConfigService) => config.get('email'),
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
  ],
  controllers: [LoginController],
  providers: [LoginService, JwtStrategy],
})
export class LoginModule {}
