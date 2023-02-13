import { MyException } from '@/util/MyException';
import { ModelsEnum, PickModelType } from '@/models';
import { MailerService } from '@nest-modules/mailer';
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import { SendMailDto } from './dto/sen-mail.dto';
import * as randomString from 'random-string';
import { Op } from 'sequelize';

import * as dayjs from 'dayjs';
import * as duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

type SendMailPayLoad = { captcha?: string };

@Injectable()
export class LoginService {
  constructor(
    private readonly jwtServe: JwtService,
    private readonly mailerService: MailerService,
    @Inject(ModelsEnum.AuthCode)
    private readonly authCode: PickModelType<ModelsEnum.AuthCode>,
    @Inject(ModelsEnum.User)
    private readonly user: PickModelType<ModelsEnum.User>,
  ) {}

  // 注册
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
    return await this.senMailInvoke(
      { type, email },
      (payload: SendMailPayLoad) =>
        this.mailerService.sendMail({
          to: email,
          from: `"智能点名系统" <${process.env.MAILDEV_INCOMING_USER}>`,
          subject: subject,
          template: type,
          context: payload,
        }),
    );
  }
  // 判断一下邮件是否可以发送
  async verifySendMall(email: string) {
    /**
     * 用户不存在或者 邮件未过期
     */
    const user = await this.user.findOne({ where: { email } });
    if (user) throw new MyException({ code: '400', error: '用户已注册' });
    const aut = await this.authCode.findOne({
      order: [['createdAt', 'DESC']],
      where: {
        email,
        expireTime: { [Op.gt]: new Date() },
      },
    });
    console.log('aut: ', aut);

    if (aut) {
      throw new MyException({
        code: '400',
        error: `验证码还在有效期 请在${Math.ceil(
          dayjs.duration(dayjs(aut.expireTime).diff(dayjs())).as('seconds'),
        )}秒后再试`,
      });
    }
  }

  // 获取注册验证码
  async getCaptcha(email: string) {
    let captcha: string;

    // 查找验证码是否存在
    while (true) {
      captcha = randomString({ length: 6 }).toLowerCase();
      const codeInfo = await this.authCode.findOne({
        where: {
          captcha,
        },
      });
      // 如果验证码不存在或者有有效期过了就跳出去
      if (
        !codeInfo ||
        new Date(codeInfo.toJSON().expireTime).getTime() < new Date().getTime()
      )
        break;
    }

    return captcha;
  }

  // 邮件集合
  async senMailInvoke(
    { type, email }: SendMailDto,
    cb: (payload: unknown) => any,
  ) {
    const checkSuccess = (info: any) => info.response.includes('250');
    switch (type) {
      case 'register':
        // 判断是否可以发送邮件
        await this.verifySendMall(email);
        const captcha = await this.getCaptcha(email);
        const isSuccess = checkSuccess(await cb({ captcha }));
        if (!isSuccess) return isSuccess;
        // 保存到数据库
        const res = await this.authCode.create({
          email,
          captcha,
          expireTime: dayjs().add(1, 'minute').toDate(),
        });
        return !!res;
    }
  }
}
