import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();
    const { method, originalUrl, body } = req;

    // dùng để log request đến server
    console.log(`[Request] ${method} ${originalUrl} - Body: ${JSON.stringify(body)}`);
    const processId = process.pid;
    next();
  }
}
