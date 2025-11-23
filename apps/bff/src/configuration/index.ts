class Configuration {
  NODE_ENV: string;

  IS_DEV: boolean;

  GLOBAL_PREFIX: string;

  PORT: number;

  constructor() {
    this.NODE_ENV = process.env.NODE_ENV || 'development';
    this.IS_DEV = this.NODE_ENV === 'development';
    this.GLOBAL_PREFIX = process.env.GLOBAL_PREFIX || 'api';
    this.PORT = parseInt(process.env.PORT || '3000', 10);
  }
}

export const CONFIGURATION = new Configuration();

export type TConfiguration = typeof CONFIGURATION;
