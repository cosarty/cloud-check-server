import { HttpStatus } from '@nestjs/common';
export type Data = {
  code: number;
  message: string;
  data: string;
  info?: any;
};

export type ErrorDataImp = {
  code: `${HttpStatus}`;
  error: ValidateErrInfo[] | string;
  success?: boolean;
};

export type ValidateErrInfo = {
  field: string;
  message: string;
};

export type BaseData<T> = {
  success: boolean;
  data: T;
  timestamp: Date;
  message?: string;
  code: number;
};
