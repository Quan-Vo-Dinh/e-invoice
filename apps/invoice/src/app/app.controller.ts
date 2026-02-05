import { Controller, Get, Logger, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';
import { TcpLoggingInterceptor } from '@common/interceptors/tcpLogging.interceptor';
import { Response } from '@common/interfaces/tcp/common/response.interface';
import { Request } from '@common/interfaces/tcp/common/request.interface';
import { ProcessId } from '@common/decorators/processId.decorator';
import { RequestParam } from '@common/decorators/request-param.decorator';

@UseInterceptors(TcpLoggingInterceptor)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @MessagePattern('get_invoice')
  getInvoice(
    @ProcessId() processId: string,
    @RequestParam() params: Request<{ invoiceId: number; invoiceName: string }>,
    @RequestParam('invoiceId') invoiceId: number,
  ): Response<string> {
    Logger.debug('processId', processId);
    Logger.debug('params', params);
    Logger.debug('invoiceId', invoiceId);
    return Response.success<string>(`Invoice Data for ID: ${invoiceId}`);
  }
}
