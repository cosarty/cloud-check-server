import { ModelsEnum, PickModelType } from '@/models';
import { MailerService } from '@nest-modules/mailer';
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import { SendMailDto } from './dto/sen-mail.dto';

type SendMailPayLoad = { captcha?: string };

@Injectable()
export class LoginService {
  constructor(
    private readonly jwtServe: JwtService,
    private readonly mailerService: MailerService,
    @Inject(ModelsEnum.AuthCode)
    private readonly authCode: PickModelType<ModelsEnum.AuthCode>,
  ) {}
  async create(createLoginDto: CreateUserDto) {
    console.log('createLoginDto: ', createLoginDto);

    return {
      message: '获取成功',
      data: { token: await this.jwtServe.signAsync({ user: { name: 'cxn' } }) },
    };
  }

  // 发送邮件
  async sendMail({
    email,
    subject = '默认主题',
    type,
  }: SendMailDto & { subject: string }) {
    return await this.senMailInvoke(type, (payload: SendMailPayLoad) =>
      this.mailerService.sendMail({
        to: email,
        from: `"智能点名系统" <${process.env.MAILDEV_INCOMING_USER}>`,
        subject: subject,
        template: type,
        context: payload,
      }),
    );
  }

  // 获取验证码
  async getCaptcha() {
    return false;
  }

  // 邮件种类集合
  async senMailInvoke(
    type: SendMailDto['type'],
    cb: (payload: unknown) => any,
  ) {
    const checkSuccess = (info: any) => info.response.includes('250');
    switch (type) {
      case 'register':
        const captcha = await this.getCaptcha();

        const isSuccess = checkSuccess(await cb({ captcha }));
        if (!isSuccess) return isSuccess;
        // const captcha = await this.getCaptcha();
        // context.captcha = captcha;
        break;
    }
  }
}
