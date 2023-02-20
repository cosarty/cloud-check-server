import { ClassController } from './class.controller';
import { ClassService } from './class.service';

import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [ClassController],
  providers: [ClassService],
})
export class ClassModule {}
