import { Controller, Post, Body, Req } from '@nestjs/common';
import { LoginService } from './login.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Admin } from '@/common/role/auth.decorator';
import { Request } from 'express';
import { SendMailDto } from './dto/sen-mail.dto';
import { MyException } from '@/util/MyException';

@Controller('genIn')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  // 注册接口
  /**
   * 注册接口有着两种 情况
   * // TODO 1. 老师分配 学生完善邮箱
   * // TODO 2. 学生邮箱自主注册
   * @param createLoginDto
   * @returns
   */
  @Post('register')
  async register(@Body() createUser: CreateUserDto) {
    return this.loginService.create(createUser);
  }

  @Post('login')
  @Admin()
  async login(@Req() req: Request, @Body() payload: any) {
    return req.user;
  }

  // 邮件发送
  @Post('sendMail')
  async sendMail(@Body() { email, type }: SendMailDto) {
    const isSuccess = await this.loginService.sendMail({
      email,
      subject: '注册邀请',
      type,
    });
    if (!isSuccess)
      throw new MyException({ error: '服务器错误，发送失败', code: '400' });
    return null;
    // this.sendMail();
  }
}
