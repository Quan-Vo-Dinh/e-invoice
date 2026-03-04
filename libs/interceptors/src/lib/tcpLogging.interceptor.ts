import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { catchError, Observable, tap } from 'rxjs';
import { RpcException } from '@nestjs/microservices';
import { HTTP_MESSAGE } from '@common/constants/enum/http-message.enum';
import { HttpStatus } from '@nestjs/common';

@Injectable()
export class TcpLoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const now = Date.now();
    const handler = context.getHandler();
    const handlerName = handler.name || 'unknown_handler';

    const args = context.getArgs();

    // lấy vị trí đầu tiên thì nó đại diện cho payload trong TCP microservice
    const param = args[0];

    const processId = param?.processId || 'unknown_process_id';

    Logger.log(
      `ProcessId: '${processId}' >> method: '${handlerName}' >> at '${now}' >> param: ${JSON.stringify(param)}`,
      TcpLoggingInterceptor.name,
    );

    return next.handle().pipe(
      tap(() =>
        Logger.log(`TCP >> End process '${processId}' >> method: '${handlerName}' after: '${Date.now() - now}ms'`),
      ),
      catchError((error) => {
        const duration = Date.now() - now;
        Logger.error(
          `TCP » Error process '${processId}': ${error.message} >> data: ${JSON.stringify(
            error,
          )}, after: '${duration}ms'`,
        );

        throw new RpcException({
          code: error.status || error.code || error.error?.code || HttpStatus.INTERNAL_SERVER_ERROR,
          message: error?.response?.message || error?.message || HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
        });
      }),
    );
  }
}
