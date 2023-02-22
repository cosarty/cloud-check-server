import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';

@Module({
  imports: [MulterModule],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
