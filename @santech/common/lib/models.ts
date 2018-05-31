import {
  IDeserializedResponse,
  IDtoAttributes,
  IEndPoints,
  IError,
  IPrivateEndPoints,
  IPublicEndPoints,
} from '@santech/core';

export interface IAuthenticateParams {
  login: string;
  password: string;
  rememberMe?: boolean;
  duration?: number;
}

export interface IJwtDto {
  idToken: string;
  userToken?: string | undefined | null;
}

export interface IPublicTokenDto {
  publicToken: string;
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
  level: TLogLevel;
  message: string;
  attributes?: IDtoAttributes | undefined | null;
}

export interface IHttpErrorDto {
  error: string;
  message: string;
  fieldErrors?: any[];
  path: string;
  timestamp: string;
}

export type TLogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

export type TTokenRecoveryPromise = void | IDeserializedResponse<IError>;
