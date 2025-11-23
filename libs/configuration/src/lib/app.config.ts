import { IsNumber } from 'class-validator';

export class AppConfiguration {
  @IsNumber()
  PORT: number;

  constructor() {
    this.PORT = parseInt(process.env['PORT'] || '3000', 10);
  }
}
