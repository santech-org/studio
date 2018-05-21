import { IDeserializedResponse, IHttpInterceptor, IPublicEndPoints } from '@santech/core';

export class HttpStatusInterceptor implements IHttpInterceptor {
  private _publicEndPoint: string | undefined;
  private _cb: Map<RegExp, (response: IDeserializedResponse<any>) => void> = new Map();

  constructor(endpoints?: IPublicEndPoints) {
    if (endpoints) {
      this._publicEndPoint = endpoints.publicEndPoint;
    }
  }

  public setStatusCallBack(regexp: string, callback: (response: IDeserializedResponse<any>) => void) {
    const key = new RegExp(regexp);
    const interceptors = this._cb;
    interceptors.set(key, callback);
    return () => interceptors.delete(key);
  }

  public removeStatusCallBack(regexp: string) {
    this._cb.forEach((_, key) => {
      if (key.source === regexp) {
        this._cb.delete(key);
      }
    });
  }

  public clearStatusCallBacks() {
    this._cb.clear();
  }

  public response(res: IDeserializedResponse<any>) {
    const publicEndpoint = this._publicEndPoint;
    const isPublicApi = publicEndpoint
      ? res.url.includes(publicEndpoint)
      : false;
    if (isPublicApi) {
      return res;
    }

    this._cb.forEach((cb, key) => {
      if (key.test(res.status.toString())) {
        return cb(res);
      }
    });

    return res;
  }
}
