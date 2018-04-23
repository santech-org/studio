import { IStdResponse } from '@santech/core';

export interface IDtoAttributes {
  [attribute: string]: string | number | boolean | string[] | IDtoAttributes | undefined | null;
}

export interface IAuthenticateParams {
  login: string;
  password: string;
  rememberMe?: boolean;
  duration?: number;
}

export interface IHttpErrorsEnum {
  unauthorized: 'error.unauthorized';
  conflict: 'error.conflict';
}

export interface IHttpErrorMessagesEnum {
  unauthorized: 'error.message.unauthorized';
  conflict: 'error.message.conflict';
}

export interface IJwtDto {
  idToken: string;
  userToken?: string | undefined | null;
}

export interface IPublicTokenDto {
  publicToken: string;
}

export interface IEndPoints {
  [endpoint: string]: string;
}

export interface IPrivateEndPoints extends IEndPoints {
  endPoint: string;
}

export interface IPublicEndPoints extends IEndPoints {
  publicEndPoint: string;
}

export interface IWsEndPoints extends IEndPoints {
  wsEndPoint: string;
}

export interface IZuulEndPoints extends IPrivateEndPoints {
  zuulEndPoint: string;
}

export interface IAuthenticatorEndPoints extends IPublicEndPoints, IPrivateEndPoints {
  authenticateEndPoint: string;
  renewEndPoint: string;
}

export interface ILogggerEndPoints extends IEndPoints {
  logEndPoint: string;
}

export interface ILogDto {
  timestamp: string;
  logLevel: TLogLevel;
  message: string;
  attributes?: IDtoAttributes | undefined | null;
}

export type TLogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

export type TAuthFailure = void | IStdResponse<any>;
