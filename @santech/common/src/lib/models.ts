export interface IDtoAttributes {
  [attribute: string]: string | number | boolean | string[] | IDtoAttributes | undefined | null;
}

export interface IAuthenticatorEndPoints {
  authenticateEndPoint: string;
  renewEndPoint: string;
}

export interface ILoggerEndPoints {
  loggerEndPoint: string;
}

export interface ILogDto {
  timestamp: string;
  level: TLogLevel;
  message: string;
}

export type TLogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

export type TTokenRecoveryPromise<T extends object> = Promise<T | null>;
