import { AuthCode } from './authCode';
import { User } from './users';

enum ModelsEnum {
  User = 'User',
  AuthCode = 'AuthCode',
}

const Models = { User, AuthCode };

export type ModelsType = typeof Models;

export type PickModelType<T extends `${ModelsEnum}`> = Pick<ModelsType, T>[T];

export { Models, ModelsEnum };
