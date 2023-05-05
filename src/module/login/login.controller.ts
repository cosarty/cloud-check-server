import {
  Controller,
  Post,
  Body,
  Req,
  Inject,
  CACHE_MANAGER,
} from '@nestjs/common';
import { LoginService } from './login.service';
import { CreateUserDto, LoginDto } from './dto/create-user.dto';
import { Auth } from '@/common/role/auth.decorator';
import { Request } from 'express';
import { SendMailDto } from './dto/sen-mail.dto';
import { MyException } from '@/util/MyException';
import { User } from '@/common/decorator/user.decorator';
import { Cache } from 'cache-manager';
import { ModelsEnum, PickModelType } from '@/models';

@Controller('genIn')
export class LoginController {
  constructor(
    private readonly loginService: LoginService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    @Inject(ModelsEnum.User)
    private readonly user: PickModelType<ModelsEnum.User>,
  ) {}

  // 注册接口
  /**
   * 注册接口有着两种 情况
   * // TODO 1. 老师分配 学生完善邮箱
   * // TODO 2. 学生邮箱自主注册
   * @param createLoginDto
   * @returns
   */
  @Post('register')
  async register(@Body() createUser: any) {
    return this.loginService.create(createUser);
  }

  @Post('login')
  async login(@Req() req: Request, @Body() payload: LoginDto) {
    return await this.loginService.login(payload);
  }

  @Post('restore')
  async restore(@Body() { userId }: any) {
    await this.user.restore({ where: { userId } });
    return { message: '还原成功' };
  }

  // 邮件发送
  @Post('sendMail')
  async sendMail(@Body() { email, type }: SendMailDto) {
    try {
      const isSuccess = await this.loginService.sendMail({
        email,
        subject: type === 'register' ? '注册邀请' : '找回密码',
        type,
      });
      if (!isSuccess)
        throw new MyException({ error: '服务器错误，发送失败', code: '400' });
      return { message: '发送成功' };
    } catch (error: any) {
      // console.log('error: ', error);
      if (error.message.includes('550')) {
        throw new MyException({ error: '邮箱不存在', code: '400' });
      }

      if (error.response?.error) {
        throw new MyException({ error: error.response?.error, code: '400' });
      }
      throw new MyException({ error: '服务器错误，发送失败', code: '400' });
    }
    // this.sendMail();
  }

  @Post('logout')
  @Auth()
  async logout(@Req() req: Request) {
    const auth = req.headers['authorization'];
    const { iat, exp, user } = req.user as any;
    await this.cache.set(`${user.userId}_${exp}`, auth, exp - iat);

    return { message: '退出成功' };
  }
}
