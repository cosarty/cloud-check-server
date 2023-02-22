import { registerAs } from '@nestjs/config';

const uploadConf = registerAs('upload', () => ({
  root: 'static',
  base: {
    classAvatarDir: 'image/class-avatar',
    userAvatarDir: 'image/class-avatar',
  },
  mime: {
    image: ['png', 'jpg', 'gif', 'jpeg'],
  },
}));
export type UploadConfType = ReturnType<typeof uploadConf>;
export default uploadConf;
