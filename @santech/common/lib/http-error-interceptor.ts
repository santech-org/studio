import { Http, IStdResponse } from '@santech/core';

// TODO move in common
export class HttpErrorInterceptor {
  private _remover: (() => void) | void;
  private _publicEndpoint: string | undefined;
  private _interceptors: Map<RegExp, (response: IStdResponse<any>) => void> = new Map();

  constructor(http: Http, publicEndpoint?: string) {
    this._remover = http.addResponseInterceptor(this._errorInterceptor.bind(this));
    this._publicEndpoint = publicEndpoint;
  }

  public setErrorInterceptor(regexp: string, callback: (response: IStdResponse<any>) => void) {
    this._interceptors.set(new RegExp(regexp), callback);
  }

  public clearErrorInterceptor(regexp: string) {
    this._interceptors.forEach((_, key) => {
      if (key.source === regexp) {
        this._interceptors.delete(key);
      }
    });
  }

  public clearErrorInterceptors() {
    this._interceptors.clear();
  }

  public removeInterceptor() {
    if (this._remover) {
      this._remover = this._remover();
    }
  }

  private _errorInterceptor(response: IStdResponse<any>) {
    const publicEndpoint = this._publicEndpoint;
    const isPublicApi = publicEndpoint
      ? response.url.includes(publicEndpoint)
      : false;
    this._interceptors.forEach((cb, key) => {
      if (key.test(response.status.toString()) && !isPublicApi) {
        return cb(response);
      }
    });
  }
}
