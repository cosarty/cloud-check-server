/*
https://docs.nestjs.com/controllers#controllers
*/

import { User } from '@/common/decorator/user.decorator';
import { Auth } from '@/common/role/auth.decorator';

import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { UpdatePasswordDto } from './dto/user.dto';
import * as argon2 from 'argon2';
import { ModelsEnum, PickModelType } from '@/models';
// 更新用户 封号

@Controller('user')
export class UserController {
  constructor(
    @Inject(ModelsEnum.User)
    private readonly user: PickModelType<ModelsEnum.User>,
  ) {}
  @Get('getCurrent')
  @Auth()
  getCurrent(@User() user) {
    return user;
  }

  @Post('updatePassword')
  @Auth()
  async updatePassword(@Body() payload: UpdatePasswordDto) {
    const hash = await argon2.hash(payload.newPassword, {
      type: argon2.argon2d,
    });
    await this.user.update(
      { password: hash },
      { where: { email: payload.email } },
    );
    return { message: '更新成功' };
  }
}
