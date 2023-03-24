import { registerAs } from '@nestjs/config';

const uploadConf = registerAs('upload', () => ({
  root: 'static',
  base: {
    classAvatarDir: {
      private: 'image/class-avatar',
      public: '/image', //虚拟目录
    },
    userAvatarDir: {
      private: 'image/user-avatar',
      public: '/image', //虚拟目录
    },
    courseAvatarDir: {
      private: 'image/course-avatar',
      public: '/image', //虚拟目录
    },
  },
  mime: {
    image: ['png', 'jpg', 'gif', 'jpeg'],
  },
}));
export type UploadConfType = ReturnType<typeof uploadConf>;
export default uploadConf;
