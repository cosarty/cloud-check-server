import { MyException } from '@/util/MyException';
import { ValidationError, ValidationPipe } from '@nestjs/common';

export class ValidatePipe extends ValidationPipe {
  protected flattenValidationErrors(
    validationErrors: ValidationError[],
  ): string[] {
    const messages = validationErrors.map((error) => {
      return {
        field: error.property,
        message: Object.values(error.constraints)[0],
      };
    });

    throw new MyException({
      code: '400',
      error: messages,
    });
  }
  // async transform(value: any, metadata: ArgumentMetadata) {
  //   const { metatype } = metadata;
  //   //前台提交的表单数据没有类型，使用 plainToClass 转为有类型的对象用于验证
  //   const object = plainToInstance(metatype, value);

  //   //根据 DTO 中的装饰器进行验证
  //   const errors = await validate(object);
  //   // console.log('errors: ', errors);
  //   if (errors.length) {
  //     throw new BadRequestException('表单数据错误');
  //   }
  //   return value;
  // }
}
