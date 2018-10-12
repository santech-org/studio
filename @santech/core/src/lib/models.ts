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

export interface IDeserializedToken {
  exp: number;
}
