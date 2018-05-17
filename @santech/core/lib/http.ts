import {
  IHttpQueryParams,
  IRequestConfig,
  IResponse,
  THttpRequestInterceptor,
  THttpResponseDeserializer,
  THttpResponseInterceptor,
} from './models';

const JSON_TYPES = ['[object Object]', '[object Array]'];

export interface IHttp {
  addRequestInterceptor(interceptor: THttpRequestInterceptor): () => void;
  addResponseDeserializer<T>(deserializer: THttpResponseDeserializer<T>): () => void;
  addResponseInterceptor<T>(interceptor: THttpResponseInterceptor<T>): () => void;
  createHeaders(headers?: HeadersInit | undefined): Headers;
  fetch<T>(input: RequestInfo, init?: IRequestConfig): Promise<IResponse<T>>;
  get<T>(url: string, config?: IRequestConfig): Promise<IResponse<T>>;
  post<T>(url: string, data: any, config?: IRequestConfig): Promise<IResponse<T>>;
  put<T>(url: string, data: any, config?: IRequestConfig): Promise<IResponse<T>>;
  delete<T>(url: string, config?: IRequestConfig): Promise<IResponse<T>>;
  patch<T>(url: string, data: any, config?: IRequestConfig): Promise<IResponse<T>>;
}

export class Http implements IHttp {
  public createHeaders: (headers?: HeadersInit | undefined) => Headers;

  private _requestInterceptors: THttpRequestInterceptor[];
  private _responseInterceptors: Array<THttpResponseInterceptor<any>>;
  private _responseDeserializers: Array<THttpResponseDeserializer<any>>;
  private _doRequest: <T>(input: RequestInfo, init: RequestInit) => Promise<IResponse<T>>;

  constructor(client: typeof fetch, headers: typeof Headers) {
    this._doRequest = this._setHttpClient(client);
    this.createHeaders = this._setHeadersConstructor(headers);
    this._requestInterceptors = [
      this._jsonRequestInterceptor.bind(this),
      this._formDataRequestInterceptor.bind(this),
    ];
    this._responseInterceptors = [];
    this._responseDeserializers = [
      this._jsonDeserializer,
      this._imageDeserializer,
      this._base64Deserializer,
      this._textPlainDeserializer,
    ];
  }

  public addRequestInterceptor(interceptor: THttpRequestInterceptor) {
    this._requestInterceptors.push(interceptor);
    return this._remover(interceptor, this._requestInterceptors);
  }

  public addResponseInterceptor<T>(interceptor: THttpResponseInterceptor<T>) {
    this._responseInterceptors.push(interceptor);
    return this._remover(interceptor, this._responseInterceptors);
  }

  public addResponseDeserializer<T>(deserializer: THttpResponseDeserializer<T>) {
    this._responseDeserializers.push(deserializer);
    return this._remover(deserializer, this._responseDeserializers);
  }

  /**
   * @description Call directly fetch + call interceptors
   */
  public fetch<T>(input: RequestInfo, init: IRequestConfig = {}): Promise<IResponse<T>> {
    try {
      return this._requestInterceptors
        .reduce((p, ri) => p.then((c) => ri(typeof input === 'string' ? input : input.url, c)), Promise.resolve(init))
        .then((config) => this._doRequest<T>(input, config))
        .then(this._deserializeResponse<T>());
    } catch (e) {
      return Promise.reject(e);
    }
  }

  public get<T>(url: string, config?: IRequestConfig): Promise<IResponse<T>> {
    return this._request<T>(url, config);
  }

  public post<T>(url: string, data: any, config?: IRequestConfig): Promise<IResponse<T>> {
    return this._request<T>(url, config, 'POST', data);
  }

  public put<T>(url: string, data: any, config?: IRequestConfig): Promise<IResponse<T>> {
    return this._request<T>(url, config, 'PUT', data);
  }

  public delete<T>(url: string, config?: IRequestConfig): Promise<IResponse<T>> {
    return this._request<T>(url, config, 'DELETE');
  }

  public patch<T>(url: string, data: any, config?: IRequestConfig): Promise<IResponse<T>> {
    return this._request<T>(url, config, 'PATCH', data);
  }

  private _setHttpClient(client: typeof fetch) {
    return (input: RequestInfo, init: RequestInit) => client(input, init) as Promise<IResponse<any>>;
  }

  private _setHeadersConstructor(headersConstructor: typeof Headers) {
    return (headers: HeadersInit = []) => new headersConstructor(headers);
  }

  private _request<T>(url: string, config: IRequestConfig = {}, method?: string, body?: any) {
    if (config.params) {
      url = [url, this._parseParams(config.params)].join('?');
    }
    if (body) {
      config.body = body;
    }
    if (method) {
      config.method = method;
    }
    return this.fetch<T>(url, config);
  }

  private _parseParams(params: IHttpQueryParams) {
    const knownTypes = ['string', 'number', 'boolean'];
    const paramToString = (k: string, v: any) => [k, encodeURIComponent(v)].join('=');

    return Object.keys(params)
      .map((key) => {
        const value = params[key];
        if (knownTypes.includes(typeof value)) {
          return paramToString(key, value);
        }

        if (Array.isArray(value)) {
          return value.map((val) => knownTypes.includes(typeof val)
            ? paramToString(key, val)
            : false)
            .filter(Boolean)
            .join('&');
        }

        return false;
      })
      .filter(Boolean)
      .join('&');
  }

  private _deserializeResponse<T>() {
    return (resp: IResponse<T>): Promise<IResponse<T>> => {
      this._responseInterceptors.forEach((i) => i(resp));
      const deserializedPromise = this._deserialize(resp);
      if (resp.ok) {
        return deserializedPromise;
      }

      return deserializedPromise.then((r) => Promise.reject(r));
    };
  }

  private _deserialize<T>(resp: IResponse<T>): Promise<IResponse<T>> {
    for (const deserializer of this._responseDeserializers) {
      const deserialized = deserializer(resp);
      if (deserialized !== resp) {
        return (deserialized as Promise<T>).then((data: T) => {
          resp.data = data;
          return resp;
        });
      }
    }
    return Promise.resolve(resp);
  }

  private _jsonRequestInterceptor(_: string, config: IRequestConfig) {
    return new Promise((res) => {
      const body = config.body;
      const headers = config.headers = this.createHeaders(config.headers);
      // Try to detect non native types #YOLO
      if (JSON_TYPES.includes(Object.prototype.toString.apply(body)) && !headers.get('content-type')) {
        headers.append('content-type', 'application/json');
      }
      if (typeof body === 'object' && headers.get('content-type') === 'application/json') {
        config.body = JSON.stringify(body);
      }

      res(config);
    });
  }

  private _formDataRequestInterceptor(_: string, config: IRequestConfig) {
    return new Promise((res) => {
      const headers = config.headers = this.createHeaders(config.headers);
      if (headers.get('content-type') === 'multipart/form-data') {
        // delete header as browser will set the boundary
        headers.delete('content-type');
      }

      res(config);
    });
  }

  private _jsonDeserializer(resp: Response) {
    const contentType = resp.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return resp.json();
    }
    return resp;
  }

  private _imageDeserializer(resp: Response) {
    const contentType = resp.headers.get('content-type');
    if (contentType && contentType.startsWith('image/')) {
      return resp.blob();
    }
    return resp;
  }

  private _base64Deserializer(resp: Response) {
    const contentType = resp.headers.get('content-type');
    if (contentType && contentType.includes('application/base64')) {
      return resp.text();
    }
    return resp;
  }

  private _textPlainDeserializer(resp: Response) {
    const contentType = resp.headers.get('content-type');
    if (contentType && contentType.includes('text/plain')) {
      return resp.text();
    }
    return resp;
  }

  private _remover<T>(interceptor: T, interceptors: T[]) {
    return () => {
      const index = interceptors.indexOf(interceptor);
      if (index >= 0) {
        interceptors.splice(index, 1);
      }
    };
  }
}
