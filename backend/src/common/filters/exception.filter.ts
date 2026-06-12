import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const raw = exception instanceof HttpException ? exception.getResponse() : null;
    const message =
      typeof raw === 'object' && raw !== null && 'message' in raw
        ? (raw as { message: string | string[] }).message
        : exception instanceof Error
          ? exception.message
          : 'Internal server error';

    response.status(status).json({
      success: false,
      statusCode: status,
      message,
      error: exception instanceof Error ? exception.name : 'Error',
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}

