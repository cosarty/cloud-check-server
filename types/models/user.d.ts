export type AuthType = 'student' | 'teacher' | 'admin';
export type SexType = 0 | 1;
export type UserType = {
  userId?: string;
  userName?: string;
  email?: string;
  isBan?: boolean;
  auth?: AuthType;
  sex?: SexType;
  password?: string;
  account?: string; // 学号  或者教师号
  device?: string;
  isAdmin?: boolean;
  super?: boolean;
  classId?: string;
  pic?: string;
};
