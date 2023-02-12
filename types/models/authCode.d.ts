export type AuthCodeType = {
  expireTime: Date; // 过期时间
  email: string;
  captcha: string; // 验证码
  work: boolean; //是否生效
};
