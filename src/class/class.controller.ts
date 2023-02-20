import { Auth, Super } from '@/common/role/auth.decorator';
import { Body, Controller, Post } from '@nestjs/common';
import { ClassService } from './class.service';
import { CreateClassDto } from './dto/create-class.dto';

@Controller('class')
@Auth()
export class ClassController {
  constructor(private readonly classService: ClassService) {}
  @Post('create')
  @Super()
  async createClass(@Body() createClass: CreateClassDto) {
    return await this.classService.createClass(createClass);
  }
}
