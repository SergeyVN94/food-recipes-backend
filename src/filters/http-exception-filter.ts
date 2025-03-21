import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const { name, message, stack } = exception;
    const responseData = exception.getResponse();

    response.status(status).json({
      name,
      message,
      stack,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      ...(typeof responseData === 'string' ? { message: responseData } : responseData),
    });
  }
}
