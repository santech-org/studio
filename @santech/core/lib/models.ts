export interface IRequestInit extends RequestInit {
  params?: IHttpQueryParams | undefined;
}

export interface IRequestConfig extends IRequestInit {
  headers: Headers;
}

export interface IHttpQueryParams {
  [paramKey: string]: string | number | boolean | undefined | Array<string | number | boolean | undefined>;
}

export interface IResponse<T> extends Response {
  data?: T | undefined;
}

export interface IDeserializedResponse<T> extends IResponse<T> {
  data: T;
}

export interface IError {
  body?: any;
  code: number;
  error: string;
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

export interface IDtoAttributes {
  [attribute: string]: string | number | boolean | string[] | IDtoAttributes | undefined | null;
}

export interface IDeserializedToken {
  auth: string;
  exp: number;
  sub: string;
  uuid: string;
}
