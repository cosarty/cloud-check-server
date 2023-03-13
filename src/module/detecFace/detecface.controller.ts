import { DetectFaceService } from './detectface.service';
import { Auth } from '@/common/role/auth.decorator';
import { Body, Controller, Post } from '@nestjs/common';
import { DetectFaceDto } from './dto/face.dto';

@Controller('face')
// @Auth()
export class DetecFaceController {
  constructor(private readonly detecfaceServe: DetectFaceService) {}

  @Post('detectLivingFace')
  async detectLivingFace(@Body() detect: DetectFaceDto) {
    const detectLivingFaceResponse = await this.detecfaceServe.detectFaceClent(
      detect,
    );
     
    // const data = await this.detecfaceServe.compareFace(detect);
    return { data: detectLivingFaceResponse.body.data };
  }
}
