import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const stack = exception.stack;
    const err = exception.getResponse() as
      | { message: any; statusCode: number } // NestJS의 기본 에러
      | { error: string; statusCode: 400; message: string[] }; // class-validator의 에러

    response.status(status).json({
      timestamp: new Date().toLocaleString(),
      path: request.url,
      statusCode: status,
      data: err.message,
      detail: stack,
    });
  }
}
