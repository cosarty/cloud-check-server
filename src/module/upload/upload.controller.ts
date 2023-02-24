import {
  Body,
  Controller,
  Inject,
  Param,
  Post,
  UploadedFile,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { Image } from '@/common/decorator/upload.decorator';
import { Auth } from '@/common/role/auth.decorator';
import { User } from '@/common/decorator/user.decorator';
import { UserType } from 'types/models';
import { ModelsEnum, PickModelType } from '@/models';

@Controller('upload')
@Auth()
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    @Inject(ModelsEnum.User)
    private readonly user: PickModelType<ModelsEnum.User>,
  ) {}
  // 上传用户头像
  @Post('userAvatarDir')
  @Image('userAvatarDir')
  async image(
    @UploadedFile() file: Express.Multer.File,
    @User() payload: UserType,
  ) {
    await this.user.update(
      { pic: file.filename },
      { where: { userId: payload.userId } },
    );
    return { message: '上传成功' };
  }
}
