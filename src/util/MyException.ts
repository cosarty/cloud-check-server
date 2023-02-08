import { ErrorDataImp } from '@/types';
import { HttpException } from '@nestjs/common';

export class MyException extends HttpException {
  constructor(err: ErrorDataImp) {
    const { code, success = false, ...error } = err;
    super(
      { ...error, success, code: Number.parseInt(code) },
      Number.parseInt(code),
    );
  }
}
