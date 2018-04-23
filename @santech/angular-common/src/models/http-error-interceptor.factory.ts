import { HttpErrorInterceptor, IEndPoints } from '@santech/common';
import { Http } from '@santech/core';

export function httpErrorInterceptorFactory(http: Http, endpoints: IEndPoints) {
  return new HttpErrorInterceptor(http, endpoints.publicEndPoint);
}
