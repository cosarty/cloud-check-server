import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Data } from '../types';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): Data {
    return { code: 200, message: 'ok', data: 'hello world' };
  }
}
