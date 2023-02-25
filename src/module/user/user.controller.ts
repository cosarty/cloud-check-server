/*
https://docs.nestjs.com/controllers#controllers
*/

import { User } from '@/common/decorator/user.decorator';
import { Auth } from '@/common/role/auth.decorator';

import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { BindUserDto, UpdatePasswordDto } from './dto/user.dto';
import * as argon2 from 'argon2';
import { ModelsEnum, PickModelType } from '@/models';
import { UserType } from 'types/models';
// 更新用户

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
}
