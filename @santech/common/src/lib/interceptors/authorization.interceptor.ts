import { IHttpInterceptor, IPublicEndPoints, IRequestConfig } from '@santech/core';
import { Authenticator } from '../authenticator';

export class AuthorizationInterceptor implements IHttpInterceptor {
  private _auth: Authenticator;
  private _publicEndPoint: string;

  constructor(auth: Authenticator, endpoints: IPublicEndPoints) {
    this._auth = auth;
    this._publicEndPoint = endpoints.publicEndPoint;
  }

  public async request(info: RequestInfo, config: IRequestConfig): Promise<IRequestConfig> {
    const url = typeof info === 'string' ? info : info.url;

    if (url.includes(this._publicEndPoint)) {
      return config;
    }

    const auth = this._auth;

    await auth.waitForLogin;

    if (auth.isLogged()) {
      config.headers.append('Authorization', this._auth.getAuthorizationHeader());
    }

    return config;
  }
}
