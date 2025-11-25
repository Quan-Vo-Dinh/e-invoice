import { CallHandler, ExecutionContext, HttpException, Logger, NestInterceptor } from '@nestjs/common';
import { Observable, catchError, map } from 'rxjs';
import { Request } from 'express';
import { MetadataKey } from '@common/constants/common.constant';
import { ResponseDto } from '@common/interfaces/gateway/response.interface';
import { HTTP_MESSAGE } from '@common/constants/enum/http-message.enum';
import { HttpStatus } from '@nestjs/common';

export class ExceptionInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ExceptionInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const ctx = context.switchToHttp();
    const request: Request & { [MetadataKey.PROCESSID]: string; [MetadataKey.STARTTIME]: number } = ctx.getRequest();

    const processID = request[MetadataKey.PROCESSID];
    const startTime = request[MetadataKey.STARTTIME];

    return next.handle().pipe(
      map((data: ResponseDto<unknown>) => {
        const durationMs = Date.now() - startTime;
        data.processID = processID;
        data.duration = `${durationMs} ms`;
        return data;
      }),
      catchError((error) => {
        this.logger.error(`ProcessId: '${processID}' >> An error occurred during request processing.`);
        const durationMs = Date.now() - startTime;

        const message = error.response?.message || error.message || HTTP_MESSAGE.INTERNAL_SERVER_ERROR;
        const statusCode =
          error?.code || error.statusCode || error?.response?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
        throw new HttpException(
          new ResponseDto({ data: null, message, statusCode, duration: `${durationMs} ms`, processID }),
          statusCode,
        );
      }),
    );
  }
}
