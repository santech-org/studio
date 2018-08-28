import { IHttpInterceptor } from '.';
import { IRequestConfig } from '../models';

const JSON_TYPES = ['[object Object]', '[object Array]'];

export class JsonRequestInterceptor implements IHttpInterceptor {
  public request(_: RequestInfo, config: IRequestConfig) {
    const body = config.body;
    const headers = config.headers;

    // Try to detect non native types #YOLO
    if (JSON_TYPES.includes(Object.prototype.toString.apply(body)) && !headers.get('content-type')) {
      headers.append('content-type', 'application/json');
    }
    if (typeof body === 'object' && headers.get('content-type') === 'application/json') {
      config.body = JSON.stringify(body);
    }

    return config;
  }
}
