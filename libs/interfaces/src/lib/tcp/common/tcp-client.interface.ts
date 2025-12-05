import { Observable } from 'rxjs';
import { RequestType } from './request.interface';
import { ResponseType } from './response.interface';

// custom TCP client interface từ thằng Client Proxy của NestJS Microservices
// 2 method này đọc trong type của nó khi ctrl + click vào ClientProxy để xem và custom lại theo kiểu generic
export interface TcpClient {
  send<TResult = any, TInput = any>(pattern: any, data: RequestType<TInput>): Observable<ResponseType<TResult>>;
  emit<TResult = any, TInput = any>(pattern: any, data: RequestType<TInput>): Observable<ResponseType<TResult>>;
}
