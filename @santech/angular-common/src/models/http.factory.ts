import { Http, IHttpDeserializer, IHttpInterceptor } from '@santech/core';

export function httpFactory(
  client: any,
  deserializers: Array<IHttpDeserializer<any>>,
  headers: any,
  interceptors: IHttpInterceptor[]) {
  return new Http({
    client,
    deserializers,
    headers,
    interceptors,
  });
}
