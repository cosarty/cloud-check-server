import { AuthCode } from './authCode';
import { User } from './users';
import { Class } from './class';

enum ModelsEnum {
  User = 'User',
  AuthCode = 'AuthCode',
  Class = 'Class',
}

const Models = { User, AuthCode, Class };

export type ModelsType = typeof Models;

export type PickModelType<T extends `${ModelsEnum}`> = Pick<ModelsType, T>[T];

export { Models, ModelsEnum };
