import { DetecFaceController } from './detecface.controller';

import { Module } from '@nestjs/common';
import { DetectFaceService } from './detectface.service';

@Module({
  imports: [],
  controllers: [DetecFaceController],
  providers: [DetectFaceService],
})
export class DetecFaceModule {}
