import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}
  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  image(@UploadedFile() file: Express.Multer.File) {
    return file;
  }
}
