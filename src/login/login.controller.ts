import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
  Inject,
} from '@nestjs/common';
import { LoginService } from './login.service';
import { CreateLoginDto } from './dto/create-login.dto';
import { Admin } from '@/common/role/auth.decorator';
import { MailerService } from '@nest-modules/mailer';

@Controller('genIn')
export class LoginController {
  constructor(
    private readonly loginService: LoginService,
    private readonly mailerService: MailerService,
  ) {}

  // 注册接口
  @Post('register')
  async register(@Body() createLoginDto: any) {
    await this.mailerService.sendMail({
      to: '414359193@qq.com',
      from: `"智能点名系统" <${process.env.MAILDEV_INCOMING_USER}>`,
      subject: '注册邀请',
      template: 'register',
      context: {
        captcha: 'abcd',
      },
    });
    // console.log('createLoginDto: ', createLoginDto);
    return this.loginService.create(createLoginDto);
  }
}
