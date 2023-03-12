import { Controller, Get } from '@nestjs/common';
import { testClient } from './clinent';
import { Data } from '../types';
@Controller()
export class AppController {
  constructor() {}

  @Get()
  async getHello() {
  return   await testClient();

  }
}
