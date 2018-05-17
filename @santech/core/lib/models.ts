export type THttpRequestInterceptor = (request: string, config: IRequestConfig) => Promise<IRequestConfig>;
export type THttpResponseInterceptor<T> = (response: IResponse<T>) => void;
export type THttpResponseDeserializer<T> = (response: IResponse<T>) => (Promise<T> | Response);

export interface IResponse<T> extends Response {
  data: T;
}

export interface IHttpQueryParams {
  [paramKey: string]: string | number | boolean | undefined | Array<string | number | boolean | undefined>;
}

export interface IRequestConfig extends RequestInit {
  params?: IHttpQueryParams | undefined;
}

export interface IDeserializedToken {
  auth: string;
  exp: number;
  sub: string;
  uuid: string;
}
