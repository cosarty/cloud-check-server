import {
  Body,
  Controller,
  Inject,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { Image } from '@/common/decorator/upload.decorator';
import { Auth } from '@/common/role/auth.decorator';
import { User } from '@/common/decorator/user.decorator';
import { ModelsEnum, PickModelType } from '@/models';
import uploadConf from '@/config/upload.conf';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('upload')
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    @Inject(ModelsEnum.User)
    private readonly user: PickModelType<ModelsEnum.User>,
    @Inject(ModelsEnum.Class)
    private readonly classMod: PickModelType<ModelsEnum.Class>,
  ) {}
  // 上传用户头像

  @Post('userAvatarDir')
  @Auth()
  @Image('userAvatarDir')
  async userAvatarDir(
    @UploadedFile() file: Express.Multer.File,
    @User() payload: any,
    @Body() pram: any,
  ) {
    console.log('pram: ', pram);

    if (pram.flag !== 'update') {
      await this.user.update(
        { pic: file.filename },
        { where: { userId: payload.userId } },
      );
      return { message: '上传成功' };
    } else {
      console.log(
        process.env.HOST +
          uploadConf().base['userAvatarDir'].public +
          '/' +
          file.filename,
      );
      return {
        message: '上传成功',
        data:
          process.env.HOST +
          uploadConf().base['userAvatarDir'].public +
          '/' +
          file.filename,
      };
    }
  }

  /**
   * @description 上传班级头像  只能允许 [admin，super，辅导员]
   * @param file
   * @param payload
   * @returns
   */
  @Post('classAvatarDir')
  // @UseGuards(VerifyClassGuard)
  @Auth(['admin', 'teacher'])
  @Image('classAvatarDir')
  async classAvatarDir(
    // @Param() payload: UploadClassAvatar,
    @UploadedFile() file: Express.Multer.File,
  ) {
    // await this.classMod.update(
    //   { picture: file.filename },
    //   { where: { classId: payload.classId } },
    // );
    return {
      message: '上传成功',
      data:
        process.env.HOST +
        uploadConf().base['classAvatarDir'].public +
        '/' +
        file.filename,
    };
  }
}
