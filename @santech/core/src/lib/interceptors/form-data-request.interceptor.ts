import { IHttpInterceptor } from '.';
import { IRequestConfig } from '../models';

export class FormDataRequestInterceptor implements IHttpInterceptor {
  public request(_: RequestInfo, config: IRequestConfig) {
    const headers = config.headers;
    if (headers.get('content-type') === 'multipart/form-data') {
      // delete header as browser will set the boundary
      headers.delete('content-type');
    }
    return config;
  }
}
