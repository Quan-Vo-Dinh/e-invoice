import { TCP_SERVICES } from '@common/configuration/tcp.config';
import { ResponseDto } from '@common/interfaces/gateway/response.interface';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interface';
import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginRequestDto, LoginResponseDto } from '@common/interfaces/gateway/authorizer';
import { ProcessId } from '@common/decorators/processId.decorator';
import { LoginTcpRequest, LoginTcpResponse } from '@common/interfaces/tcp/authorizer';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enum/tcp-request-message';
import { map } from 'rxjs';
import { HTTP_MESSAGE } from '@common/constants/enum/http-message.enum';
@ApiTags('Authorizer')
@Controller('authorizer')
export class AuthorizerController {
  constructor(@Inject(TCP_SERVICES.AUTHORIZER_SERVICE) private readonly authorizerClient: TcpClient) {}

  @Post('login')
  @ApiOkResponse({ type: ResponseDto<LoginResponseDto> })
  @ApiOperation({
    summary: 'Login with username and password',
  })
  login(@Body() body: LoginRequestDto, @ProcessId() processId: string) {
    return this.authorizerClient
      .send<LoginTcpResponse, LoginTcpRequest>(TCP_REQUEST_MESSAGE.AUTHORIZER.LOGIN, {
        data: body,
        processId,
      })
      .pipe(
        map(
          (response) =>
            new ResponseDto<LoginResponseDto>({
              data: response.data,
              statusCode: response.statusCode,
              message: response.code as HTTP_MESSAGE,
            }),
        ),
      );
  }
}
