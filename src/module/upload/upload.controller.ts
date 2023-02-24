import {
  Body,
  Controller,
  Inject,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { Image } from '@/common/decorator/upload.decorator';
import { Auth } from '@/common/role/auth.decorator';
import { User } from '@/common/decorator/user.decorator';
import { UserType } from 'types/models';
import { ModelsEnum, PickModelType } from '@/models';
import { UploadClassAvatar } from './dto/upload.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { VerifyClassGuard } from './guard/verify-class.guard';

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
    @User() payload: UserType,
  ) {
    await this.user.update(
      { pic: file.filename },
      { where: { userId: payload.userId } },
    );
    return { message: '上传成功' };
  }

  /**
   * @description 上传班级头像  只能允许 [admin，super，辅导员]
   * @param file
   * @param payload
   * @returns
   */
  @Post('classAvatarDir/:classId')
  @UseGuards(VerifyClassGuard)
  @Auth(['admin', 'teacher'])
  @Image('classAvatarDir')
  async classAvatarDir(
    @Param() payload: UploadClassAvatar,
    @UploadedFile() file: Express.Multer.File,
  ) {
    await this.classMod.update(
      { picture: file.filename },
      { where: { classId: payload.classId } },
    );
    return { message: '更新成功' };
  }
}
