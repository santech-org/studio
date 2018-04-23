export type THttpRequestInterceptor = (request: string, config: IStdRequestConfig) => Promise<IStdRequestConfig>;
export type THttpResponseInterceptor<T> = (response: IStdResponse<T>) => void;
export type THttpResponseDeserializer<T> = (response: IStdResponse<T>) => (Promise<T> | Response);

export interface IStdResponse<T> extends Response {
  data: T;
}

export interface IStdHttpQueryParams {
  [paramKey: string]: string | number | boolean | undefined | Array<string | number | boolean | undefined>;
}

export interface IStdRequestConfig extends RequestInit {
  params?: IStdHttpQueryParams | undefined;
}

export interface IDeserializedToken {
  auth: string;
  exp: number;
  sub: string;
  uuid: string;
}
