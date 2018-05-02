import { IDeserializedToken, IHttp, IJwt, IStdResponse, ITokenStorage } from '@santech/core';
import { httpErrors } from './constants';
import { IAuthenticateParams, IAuthenticatorEndPoints, IJwtDto, TAuthFailure } from './models';

export interface IAuthenticator {
  readonly waitForLogin: Promise<TAuthFailure>;
  readonly jwt: IDeserializedToken;
  readonly token: string;
  authenticate(params: IAuthenticateParams): Promise<TAuthFailure>;
  authenticateWithJwt(jwt: IJwtDto): Promise<TAuthFailure>;
  renewToken(): Promise<TAuthFailure>;
  getAuthorizationHeader(): string;
  isLogged(): boolean;
  logout(): void;
}

/**
 * @description Use this class to authenticate on API
 */
export class Authenticator implements IAuthenticator {
  /**
   * @description Add a callback when logged out
   */
  public static addLogoutHook(cb: () => void) {
    const hooks = this._logoutHooks;
    hooks.push(cb);
    return () => {
      const index = hooks.indexOf(cb);
      if (index >= 0) {
        hooks.splice(index, 1);
      }
    };
  }

  private static _logoutHooks: Array<() => void> = [];

  private _tokenRenewer: void | number | undefined;
  private _token: string | undefined;
  private _http: IHttp;
  private _jwt: IJwt;
  private _storage: ITokenStorage;
  private _tokenInterceptorRemover: (() => void) | null | undefined;
  private _checkPreviousLoginInterceptorRemover: (() => void) | null | undefined;
  private _endPoints: IAuthenticatorEndPoints;
  private _waitForLogin: Promise<TAuthFailure>;

  constructor(http: IHttp, storage: ITokenStorage, jwt: IJwt, endPoints: IAuthenticatorEndPoints) {
    this._http = http;
    this._storage = storage;
    this._jwt = jwt;
    this._endPoints = endPoints;
    this._waitForLogin = this._checkAutomaticLogin((token) => this._cacheToken(token));
  }

  get waitForLogin() {
    return this._waitForLogin;
  }

  get jwt(): IDeserializedToken {
    return this._jwt.deserializeToken(this.token);
  }

  get token() {
    return this._token || '';
  }

  /**
   * @description Authenticate for given credentials and set Jwt
   */
  public authenticate(params: IAuthenticateParams) {
    const deviceName = (typeof navigator !== 'undefined' && navigator.userAgent)
      ? navigator.userAgent
      : 'no user agent';

    return this._login(() => this._http
      .post(this._endPoints.authenticateEndPoint, {
        ...params,
        deviceName,
      }));
  }

  /**
   * @description Authenticate for given Jwt
   */
  public authenticateWithJwt(jwt: IJwtDto) {
    return this._storeJwt(jwt)
      .then(() => this._waitForLogin = this._checkAutomaticLogin((token) => this._cacheToken(token)));
  }

  /**
   * @description force token renew (called automatically before token expires)
   */
  public renewToken() {
    return this._login(() => this._http
      .get(this._endPoints.renewEndPoint));
  }

  /**
   * @description Returns the API Authorization Header
   */
  public getAuthorizationHeader() {
    return 'Bearer '.concat(this.token);
  }

  /**
   * @description Returns the authentication state
   */
  public isLogged() {
    return !!this._token;
  }

  /**
   * @description Clear Jwt
   */
  public logout() {
    this._storage.removeJwt();
    this._storage.removeDeviceToken();
    this._clearTokenRenewer();
    this._clearTokenInterceptor();
    this._clearCheckPreviousLoginInterceptor();
    this._token = '';
    Authenticator._logoutHooks.forEach((cb) => cb());
  }

  private _checkAutomaticLogin(loggedCB?: (token: string) => void) {
    return this._tryRetrieveJwt()
      .then((token) => {
        const expirationDate = this._jwt.getExpirationDate(token);
        if (expirationDate && expirationDate > new Date()) {
          return typeof loggedCB === 'function'
            ? loggedCB(token)
            : undefined;
        }

        throw new Error('token expired');
      })
      .catch(() => {
        return this._tryRetrieveDeviceToken()
          .then((userToken) => this._login(() => this._http
            .post(this._endPoints.authenticateEndPoint, {
              userToken,
            }))
            .catch((res: IStdResponse<any>) => {
              this._token = '';
              return res;
            }))
          .catch(() => {
            this._token = '';
          });
      });
  }

  private _login(request: () => Promise<IStdResponse<IJwtDto>>) {
    return request()
      .catch((resp) => {
        if (resp.message === 'Failed to fetch') {
          throw new Error('no connection');
        }
        if (resp.status >= 500) {
          throw new Error('internal server error');
        }

        if (resp.status === 401) {
          const data = resp.data || {};
          const error = data.error;
          if (error === httpErrors.unauthorized || error === httpErrors.conflict) {
            throw data;
          }
        }

        throw new Error('invalid credentials');
      })
      .then((resp) => resp.data)
      .then((jwt) => this._storeJwt(jwt))
      .then((jwt) => this._cacheToken(jwt.idToken));
  }

  private _setJwtInterceptor() {
    if (!this._tokenInterceptorRemover) {
      const http = this._http;
      this._tokenInterceptorRemover = http
        .addRequestInterceptor((_, config) => {
          const headers = config.headers = http.createHeaders(config.headers);
          headers.append('Authorization', this.getAuthorizationHeader());
          return Promise.resolve(config);
        });
    }
  }

  private _setCheckPreviousLoginInterceptor() {
    if (!this._checkPreviousLoginInterceptorRemover) {
      this._checkPreviousLoginInterceptorRemover = this._http
        .addRequestInterceptor((url, config) => {
          if (url.includes(this._endPoints.publicEndPoint)) {
            return Promise.resolve(config);
          }

          const promise = this._waitForLogin = this
            ._checkAutomaticLogin();

          return promise.then(() => config);
        });
    }
  }

  private _tryRetrieveJwt() {
    try {
      return Promise.resolve<string>(this._storage.getJwt());
    } catch (e) {
      return Promise.reject<typeof e>(e);
    }
  }

  private _tryRetrieveDeviceToken() {
    try {
      return Promise.resolve<string>(this._storage.getDeviceToken());
    } catch (e) {
      return Promise.reject<typeof e>(e);
    }
  }

  private _storeJwt(jwt: IJwtDto) {
    return new Promise<IJwtDto>((resolve) => {
      const storePromises = [
        Promise.resolve((this._storage.setJwt(jwt.idToken)) as PromiseLike<void>),
      ];
      if (jwt.userToken) {
        storePromises
          .push(Promise.resolve((this._storage.setDeviceToken((jwt.userToken as string)) as PromiseLike<void>)));
      }
      return Promise.all(storePromises)
        .then(() => resolve(jwt));
    });
  }

  private _cacheToken(token: string) {
    this._token = token;
    this._setCheckPreviousLoginInterceptor();
    this._setJwtInterceptor();
    this._registerTokenRenewer();
  }

  private _registerTokenRenewer() {
    this._clearTokenRenewer();
    // token expiration - 5 minutes
    const msExpires = (this._jwt.getExpirationDate(this.token) as Date).getTime() - Date.now() - (5 * 60000);
    const interval = Math.max(msExpires, 0);
    this._tokenRenewer = setTimeout(() => this.renewToken(), interval);
  }

  private _clearTokenRenewer() {
    if (this._tokenRenewer) {
      this._tokenRenewer = clearTimeout(this._tokenRenewer);
    }
  }

  private _clearTokenInterceptor() {
    if (this._tokenInterceptorRemover) {
      this._tokenInterceptorRemover();
      this._tokenInterceptorRemover = null;
    }
  }

  private _clearCheckPreviousLoginInterceptor() {
    if (this._checkPreviousLoginInterceptorRemover) {
      this._checkPreviousLoginInterceptorRemover();
      this._checkPreviousLoginInterceptorRemover = null;
    }
  }
}
