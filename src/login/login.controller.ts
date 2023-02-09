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
import { UpdateLoginDto } from './dto/update-login.dto';
import { Admin } from '@/common/role/auth.decorator';
import { Login } from '@/models';

@Controller('login')
export class LoginController {
  constructor(
    private readonly loginService: LoginService,
    @Inject('LOGIN') private readonly sql: typeof Login,
  ) {}

  @Post()
  create(@Body() createLoginDto: CreateLoginDto) {
    // console.log('createLoginDto: ', createLoginDto);
    return this.loginService.create(createLoginDto);
  }

  @Get()
  @Admin()
  async findAll(@Query() createLoginDto: any, @Req() req) {
    await this.sql.upsert({ password: 'gfd', userName: 'bvc' });
    const user = await this.sql.findAll();
    // console.log('user: ', user);
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
