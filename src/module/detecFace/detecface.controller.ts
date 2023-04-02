import { DetectFaceService } from './detectface.service';
import { Auth } from '@/common/role/auth.decorator';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { DetectFaceDto } from './dto/face.dto';
import { User } from '@/common/decorator/user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('face')
// @Auth()
export class DetecFaceController {
  constructor(private readonly detecfaceServe: DetectFaceService) {}

  // 检测人脸
  @Post('detectLivingFace')
  @Auth()
  async detectLivingFace(@Body() detect: DetectFaceDto, @User() user) {
    const detectLivingFaceResponse = await this.detecfaceServe.detectFaceClent(
      detect,
    );

    let msg: string;
    const elements = detectLivingFaceResponse.body.data.elements;
    let isfaceSuccsess = elements[0].results[0].suggestion === 'pass';

    if (isfaceSuccsess) {
      const res = await this.detecfaceServe.searchFace(detect.imageData);
      console.log('res[0]: ', res[0]);

      if (
        res.body?.data?.matchList?.[0]?.faceItems?.[0]?.entityId?.replace(
          /_/g,
          '-',
        ) &&
        user.userId
      ) {
        msg = '您已录入请不要代替同学录入';
        isfaceSuccsess = false;
      }
    }
    console.log('msg: ', msg);

    return {
      isfaceSuccsess,
      msg,
    };
  }

  // 录入人脸
  @Post('enteryFace')
  @UseInterceptors(FileInterceptor('imageUrl'))
  @Auth()
  async enteryFace(@User() user, @UploadedFile() file: Express.Multer.File) {
    // console.log('file: ', file);
    // 创建人脸样本
    await this.detecfaceServe.addFaceEntity(user.userId);
    // 添加人脸数据

    await this.detecfaceServe.entryFace(user.userId, file.buffer);

    return { message: '录入成功' };
  }
  //创建人脸数据库
  @Post('createFaceDb')
  async createFaceDb(@Body() para: any) {
    await this.detecfaceServe.createFaceDb(para.dbName);

    return { message: '创建成功' };
  }

  @Get('searchFaceEntity/:id')
  async searchFaceEntity(@Param() param: any) {
    const data = await this.detecfaceServe.searchFaceEntity(param.id);
    return data.body.data;
  }
}
