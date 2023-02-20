import { Super } from '@/common/role/auth.decorator';
import { Body, Controller, Post } from '@nestjs/common';
import { CreateClassDto } from './dto/create-class.dto';

@Controller('class')
export class ClassController {
  @Post('create')
  @Super()
  createClass(@Body() createClass: CreateClassDto) {}
}
