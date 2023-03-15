import { UpdateEmailDto } from './dto/user.dto';
/*
https://docs.nestjs.com/controllers#controllers
*/

import { User } from '@/common/decorator/user.decorator';
import { Auth } from '@/common/role/auth.decorator';

import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { BindUserDto, UpdatePasswordDto } from './dto/user.dto';
import * as argon2 from 'argon2';
import { ModelsEnum, PickModelType } from '@/models';
import { UserType } from '@/models/users';
// 更新用户

@Controller('user')
export class UserController {
  constructor(
    @Inject(ModelsEnum.User)
    private readonly user: PickModelType<ModelsEnum.User>,
    @Inject(ModelsEnum.AuthCode)
    private readonly authCode: PickModelType<ModelsEnum.AuthCode>,
  ) {}
  @Get('getCurrent')
  @Auth()
  getCurrent(@User() user) {
    return user;
  }

  @Post('updatePassword')
  @Auth()
  async updatePassword(@Body() payload: UpdatePasswordDto, @User() user) {
    const hash = await argon2.hash(payload.newPassword, {
      type: argon2.argon2d,
    });
    await this.user.update(
      { password: hash },
      { where: { email: user.email } },
    );
    return { message: '更新成功' };
  }

  // 更新用户
  @Post('update')
  @Auth()
  async updateUser(@Body() payload: UserType, @User() user) {
    await this.user.update(
      { sex: payload.sex },
      { where: { userId: user.userId } },
    );
    return { message: '更新成功' };
  }

  @Post('bind')
  @Auth(['super'])
  async bindUser(@User() user: UserType, @Body() payload: BindUserDto) {
    // 封号 要清空班级 删除课程
    await this.user.update(
      { isBan: true },
      { where: { userId: payload.userId } },
    );
    return { message: '封号成功' };
  }

  // 更改邮箱
  @Post('updateEmail')
  @Auth()
  async updateEmail(@Body() payload: UpdateEmailDto, @User() user) {
    await this.user.update(
      { email: payload.email },
      { where: { userId: user.userId } },
    );
    await this.authCode.update(
      { work: false },
      { where: { email: payload.email } },
    );
    await this.authCode.update(
      { work: true },
      { where: { email: user.email } },
    );
    return null;
  }
}
