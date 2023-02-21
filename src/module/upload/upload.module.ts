import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';

@Module({
  imports: [
    MulterModule.registerAsync({
      useFactory() {
        return {
          storage: diskStorage({
            //文件储存位置
            destination: join(process.cwd(), 'src', 'static'),
            //文件名定制
            filename: (req, file, callback) => {
              const path =
                Date.now() +
                '-' +
                Math.round(Math.random() * 1e10) +
                extname(file.originalname);
              callback(null, path);
            },
          }),
        };
      },
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
