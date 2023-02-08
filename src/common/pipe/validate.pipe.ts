import { ValidateErrInfo } from '@/types';
import { MyException } from '@/util/MyException';
import {
  ArgumentMetadata,
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { plainToClass, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

const deepError = (errors: ValidationError): ValidateErrInfo[] => {
  const field = errors.property;
  const message = errors.constraints
    ? Object.values(errors.constraints)[0]
    : '';
  if (errors.children?.length > 0) {
    const errList: ValidateErrInfo[] = [];
    for (const error of errors.children) {
      error.property = `${field}.${error.property}`;
      let err: any = deepError(error);
      err = Array.isArray(err) ? err.flat(Infinity) : [err];
      errList.push(...err);
    }
    return errList;
  }
  return [{ field, message }];
};

export class ValidatePipe extends ValidationPipe {
  // protected flattenValidationErrors(
  //   validationErrors: ValidationError[],
  // ): string[] {
  //   const messages = validationErrors.flatMap((error) => {
  //     return deepError(error);
  //   });

  //   throw new MyException({
  //     code: '400',
  //     error: messages,
  //   });
  // }
  async transform(value: any, metadata: ArgumentMetadata) {
    const { metatype } = metadata;
    //前台提交的表单数据没有类型，使用 plainToClass 转为有类型的对象用于验证
    const object = plainToClass(metatype, value);

    //根据 DTO 中的装饰器进行验证
    const errors = await validate(object);

    if (errors.length) {
      const messages = errors.flatMap((error) => {
        return deepError(error);
      });

      throw new MyException({ error: messages, code: '400' });
    }
    return value;
  }
}
