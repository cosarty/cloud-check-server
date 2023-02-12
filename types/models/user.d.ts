export type AuthType = 'admin' | 'student' | 'teacher' | 'super';
export type SexType = 0 | 1;
export type UserType = {
  user_id: string;
  user_name: string;
  emial: string;
  is_ban: boolean;
  auth: AuthType;
  sex: SexType;
  password: string;
  account: string;
  device: string;
};
