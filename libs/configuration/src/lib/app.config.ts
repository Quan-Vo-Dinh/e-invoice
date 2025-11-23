export class AppConfiguration {
  PORT: number;

  constructor() {
    this.PORT = parseInt(process.env['PORT'] || '3000', 10);
  }
}
