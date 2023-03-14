import { Controller, Get } from '@nestjs/common';
import { Data } from '../types';
@Controller()
export class AppController {
  constructor() {}

  @Get()
  async getHello() {
    return { data: 'hello' };
  }
}
