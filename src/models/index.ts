import { AuthCode } from './authCode';
import { User } from './users';
import { Class } from './class';
import { Department } from './department';
import { Course } from './course';
import { ClassSchedule } from './classSchedule';
import { StatInfo } from './statInfo';
import { SingTask } from './singTask';
import { CoursePerson } from './coursePerson';
import { Area } from './area';
enum ModelsEnum {
  User = 'User',
  AuthCode = 'AuthCode',
  Class = 'Class',
  Department = 'Department',
  Course = 'Course',
  ClassSchedule = 'ClassSchedule',
  StatInfo = 'StatInfo',
  SingTask = 'SingTask',
  CoursePerson = 'CoursePerson',
  Area = 'Area',
}

const Models = {
  User,
  AuthCode,
  Class,
  Department,
  Course,
  ClassSchedule,
  StatInfo,
  SingTask,
  CoursePerson,
  Area,
};

export type ModelsType = typeof Models;

export type PickModelType<T extends `${ModelsEnum}`> = Pick<ModelsType, T>[T];

export { Models, ModelsEnum };
