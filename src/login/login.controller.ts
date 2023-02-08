import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
  Inject,
} from '@nestjs/common';
import { LoginService } from './login.service';
import { CreateLoginDto } from './dto/create-login.dto';
import { UpdateLoginDto } from './dto/update-login.dto';
import { AuthGuard } from '@nestjs/passport';
import { Admin, Auth } from '@/common/role/auth.decorator';
import { AuthEnum } from '@/constants/authEnum';
import { Sequelize } from 'sequelize-typescript';
import { Login } from './entities/login.entity';

@Controller('login')
export class LoginController {
  constructor(
    private readonly loginService: LoginService,
    @Inject('DATA_MODELS') private readonly sql: typeof Login,
  ) {}

  @Post()
  create(@Body() createLoginDto: CreateLoginDto) {
    // console.log('createLoginDto: ', createLoginDto);
    return this.loginService.create(createLoginDto);
  }

  @Get()
  @Admin()
  async findAll(@Query() createLoginDto: any, @Req() req) {
    const user = await this.sql.findAll();
    return user[0].dataValues;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.loginService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLoginDto: UpdateLoginDto) {
    return this.loginService.update(+id, updateLoginDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.loginService.remove(+id);
  }
}
