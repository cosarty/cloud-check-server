export enum AuthEnum {
  ADMIN = 'admin',
  SUPER = 'super',
  TEACHER = 'teacher',
  STUDENT = 'student',
}

export type RoleType = `${AuthEnum}`;
