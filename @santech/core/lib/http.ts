import { IHttpDeserializer } from './deserializers';
import { IHttpInterceptor } from './interceptors';
import { IDeserializedResponse, IHttpQueryParams, IRequestConfig, IRequestInit, IResponse } from './models';

export interface IHttpParams {
  client: typeof fetch;
  headers: typeof Headers;
  interceptors?: IHttpInterceptor[] | undefined;
  deserializers?: Array<IHttpDeserializer<any>> | undefined;
}

export interface IHttp {
  addInterceptor(interceptor: IHttpInterceptor): () => void;
  addDeserializer<T>(deserializer: IHttpDeserializer<T>): () => void;
  createHeaders(headers?: HeadersInit | undefined): Headers;
  fetch<T>(input: RequestInfo, init?: IRequestConfig): Promise<IDeserializedResponse<T>>;
  get<T>(url: string, config?: IRequestConfig): Promise<IDeserializedResponse<T>>;
  post<T>(url: string, data: any, config?: IRequestConfig): Promise<IDeserializedResponse<T>>;
  put<T>(url: string, data: any, config?: IRequestConfig): Promise<IDeserializedResponse<T>>;
  delete<T>(url: string, config?: IRequestConfig): Promise<IDeserializedResponse<T>>;
  patch<T>(url: string, data: any, config?: IRequestConfig): Promise<IDeserializedResponse<T>>;
}

export class Http implements IHttp {
  public createHeaders: (headers?: HeadersInit | undefined) => Headers;

  private _interceptors: IHttpInterceptor[];
  private _deserializers: Array<IHttpDeserializer<any>>;
  private _doRequest: <T>(input: RequestInfo, init: RequestInit) => Promise<IResponse<T>>;

  constructor(params: IHttpParams) {
    this._interceptors = params.interceptors || [];
    this._deserializers = params.deserializers || [];
    this._doRequest = this._setHttpClient(params.client);
    this.createHeaders = this._setHeadersConstructor(params.headers);
  }

  public addInterceptor(interceptor: IHttpInterceptor) {
    this._interceptors.push(interceptor);
    return this._remover(interceptor, this._interceptors);
  }

  public addDeserializer<T>(deserializer: IHttpDeserializer<T>) {
    this._deserializers.push(deserializer);
    return this._remover(deserializer, this._deserializers);
  }

  /**
   * @description Call directly fetch + call interceptors
   */
  public async fetch<T>(requestInfo: RequestInfo, requestInit: RequestInit = {}): Promise<IDeserializedResponse<T>> {
    const baseConfig: IRequestConfig = {
      ...requestInit,
      headers: this.createHeaders(requestInit.headers),
    };

    const config = await this._interceptors
      .reduce(async (p, i) => i.request ? i.request.call(i, requestInfo, await p) : p, Promise.resolve(baseConfig));

    const res = await this._doRequest<T>(requestInfo, config);
    const des = this._deserialize(res);

    const end = await this._interceptors
      .reduce(async (p, i) => i.response ? i.response.call(i, await p) : p, des);

    if (end.ok) {
      return end;
    }
    throw end;
  }

  public async get<T>(url: string, config?: IRequestInit): Promise<IDeserializedResponse<T>> {
    return this._request<T>(url, config);
  }

  public async post<T>(url: string, body: any, config?: IRequestInit): Promise<IDeserializedResponse<T>> {
    return this._request<T>(url, config, {
      body,
      method: 'POST',
    });
  }

  public async put<T>(url: string, body: any, config?: IRequestInit): Promise<IDeserializedResponse<T>> {
    return this._request<T>(url, config, {
      body,
      method: 'PUT',
    });
  }

  public async delete<T>(url: string, config?: IRequestInit): Promise<IDeserializedResponse<T>> {
    return this._request<T>(url, config, {
      method: 'DELETE',
    });
  }

  public async patch<T>(url: string, body: any, config?: IRequestInit): Promise<IDeserializedResponse<T>> {
    return this._request<T>(url, config, {
      body,
      method: 'PATCH',
    });
  }

  private _setHttpClient(client: typeof fetch) {
    return (input: RequestInfo, init: IRequestInit) => client(input, init);
  }

  private _setHeadersConstructor(headersConstructor: typeof Headers) {
    return (headers: HeadersInit = []) => new headersConstructor(headers);
  }

  private async _request<T>(url: string, config: IRequestInit = {}, meta: { method?: string, body?: any } = {}) {
    const { params } = config;
    const queryString = this._parseParams(params);
    Object.assign(config, meta);
    return this.fetch<T>(queryString ? `${url}?${queryString}` : url, config);
  }

  private _parseParams(params: IHttpQueryParams = {}) {
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

  private async _deserialize(resp: IResponse<any>): Promise<IDeserializedResponse<any>> {
    for (const deserializer of this._deserializers) {
      const data = await deserializer.deserialize.call(deserializer, resp);
      if (data !== resp) {
        Object.assign(resp, { data });
        return resp as IDeserializedResponse<any>;
      }
    }
    Object.assign(resp, { data: {} });
    return resp as IDeserializedResponse<any>;
  }

  private _remover<T>(func: T, funcs: T[]) {
    return () => {
      const index = funcs.indexOf(func);
      if (index >= 0) {
        funcs.splice(index, 1);
      }
    };
  }
}
