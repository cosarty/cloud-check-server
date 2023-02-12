import { ErrorDataImp } from '@/types';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { BaseError, Error } from 'sequelize';

/**
 * 全局的异常拦截器
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse() as Response;
    const request = ctx.getRequest();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const message = exception.getResponse() as ErrorDataImp;
      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        ...message,
      });
      return;
    }

    // sequelize 验证失败
    if (
      exception instanceof BaseError &&
      exception?.name === 'SequelizeValidationError'
    ) {
      const message: ErrorDataImp = {
        code: '400',
        success: false,
        error: (exception as any).errors.map(({ message, path }) => ({
          field: path,
          message,
        })) as ErrorDataImp['error'],
      };
      response.status(400).json({
        statusCode: 400,
        timestamp: new Date().toISOString(),
        path: request.url,
        ...message,
      });
      return;
    }

    console.log('exception: ', exception);
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).send(exception);
  }
}
