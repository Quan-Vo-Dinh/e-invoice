import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

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
      tap(() => {
        const duration = Date.now() - now;
        Logger.log(
          `ProcessId: '${processId}' >> method: '${handlerName}' >> completed in '${duration}ms'`,
          TcpLoggingInterceptor.name,
        );
      }),
    );
  }
}
