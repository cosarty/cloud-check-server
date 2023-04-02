import { MyException } from '@/util/MyException';
import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { getExtension } from 'mime';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import uploadConf, { UploadConfType } from '@/config/upload.conf';
import * as fs from 'fs';
export function fileMimetypeFilter(mimes: string[] = []) {
  return (
    req: any,
    file: Express.Multer.File,
    callback: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    if (mimes.includes(getExtension(file.mimetype))) {
      callback(null, true);
    } else {
      callback(
        new MyException({
          error: '文件类型必须是：' + mimes.map((f) => '.' + f).join(' '),
          code: '400',
        }),
        false,
      );
    }
  };
}

export function Upload(
  fieldName,
  mimeList?: string[],
  dir = '',
  options: MulterOptions = {},
) {
  return applyDecorators(
    UseInterceptors(
      FileInterceptor(fieldName, {
        fileFilter: fileMimetypeFilter(mimeList),
        limits: { fileSize: 1024 * 1024 * 2, files: 1 },
        storage: diskStorage({
          //文件储存位置
          destination: (req, file, callback) => {
            // 正式环境
            // const accessPath = join(
            //   process.cwd(),
            //   'dist',
            //   uploadConf().root,
            //   dir,
            // );
            const accessPath = join(
              process.cwd(),
              'src',
              uploadConf().root,
              dir,
            );
            if (!fs.existsSync(accessPath)) {
              // 递归创建目录
              fs.mkdirSync(accessPath, { recursive: true });
            }
            callback(null, accessPath);
          },
          //文件名定制
          filename: (req, file, callback) => {
            const path =
              Date.now() +
              '_' +
              (req.user as any).user.userId +
              extname(file.originalname);
            callback(null, path);
          },
        }),
        ...options,
      }),
    ),
  );
}

//图片上传
export function Image(field: keyof UploadConfType['base']) {
  return Upload(
    field,
    uploadConf().mime.image,
    uploadConf().base[field].private,
  );
}
