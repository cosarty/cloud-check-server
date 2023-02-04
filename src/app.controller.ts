import { Controller, Get } from '@nestjs/common';

import { Data } from '../types';
@Controller()
export class AppController {
  constructor() {}

  @Get()
  getHello(): Data {
    return { code: 200, message: 'ok', data: 'hello world' };
  }
}
