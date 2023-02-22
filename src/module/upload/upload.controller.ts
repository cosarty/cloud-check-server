import { Body, Controller, Post, UploadedFile } from '@nestjs/common';
import { UploadService } from './upload.service';
import { Image } from '@/common/decorator/upload.decorator';
import { Auth } from '@/common/role/auth.decorator';

@Controller('upload')
@Auth()
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}
  @Post('image')
  @Image('userAvatarDir')
  image(@UploadedFile() file: Express.Multer.File, @Body() upload) {
    console.log('upload: ', upload);
    return file;
  }
}
