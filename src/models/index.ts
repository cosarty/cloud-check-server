import { AuthCode } from './authCode';
import { User } from './users';
import { Class } from './class';
import { Department } from './department';

enum ModelsEnum {
  User = 'User',
  AuthCode = 'AuthCode',
  Class = 'Class',
  Department = 'Department',
}

const Models = { User, AuthCode, Class, Department };

export type ModelsType = typeof Models;

export type PickModelType<T extends `${ModelsEnum}`> = Pick<ModelsType, T>[T];

export { Models, ModelsEnum };
