import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';

@Catch(QueryFailedError, EntityNotFoundError)
export class TypeormExceptionsFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const { url } = request;
    const { name, message, stack } = exception;

    const errorResponse = {
      name,
      message,
      stack,
      path: url,
      timestamp: new Date().toISOString(),
    };

    response.status(HttpStatus.BAD_REQUEST).json(errorResponse);
  }
}
