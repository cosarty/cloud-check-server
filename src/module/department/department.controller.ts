import { User } from '@/common/decorator/user.decorator';
import { Auth, Super } from '@/common/role/auth.decorator';
import { ModelsEnum, PickModelType } from '@/models';

import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
} from '@nestjs/common';

@Controller('department')
export class DepartmentController {
  constructor(
    @Inject(ModelsEnum.Department)
    private readonly department: PickModelType<ModelsEnum.Department>,
  ) {}
  @Post('create')
  @Super()
  async create(@User() user, @Body() payload) {
    console.log('payload: ', payload);
    await this.department.create(
      { ...payload },
      { fields: ['departmentName', 'userId'] },
    );

    return { message: '创建成功' };
  }

  @Get('get')
  @Super()
  async getDepartment() {
    const data = await this.department.findAll({ include: ['user'] });

    return data;
  }

  // 修改系名字和 更新辅导员
  @Put('update')
  @Super()
  async update(@Body() payload) {
    await this.department.update(
      { ...payload },
      { where: { departmentId: payload.id } },
    );

    return { message: '更新成功' };
  }

  // 删除系
  @Delete('del/:id')
  @Super()
  async del(@Param() { id }) {
    await this.department.destroy({
      where: {
        departmentId: id,
      },
    });
    return { message: '删除成功' };
  }
}
