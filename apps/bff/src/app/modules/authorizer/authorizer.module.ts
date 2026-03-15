import { TCP_SERVICES, TcpProvider } from '@common/configuration/tcp.config';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { AuthorizerController } from './controllers/authorizer.controller';
import { GRPC_SERVICES, GrpcProvider } from '@common/configuration/grpc.config';

@Module({
  imports: [
    ClientsModule.registerAsync([
      TcpProvider(TCP_SERVICES.AUTHORIZER_SERVICE),
      GrpcProvider(GRPC_SERVICES.AUTHORIZER_SERVICE),
    ]),
  ],
  controllers: [AuthorizerController],
  providers: [],
  exports: [ClientsModule],
})
export class AuthorizerModule {}
