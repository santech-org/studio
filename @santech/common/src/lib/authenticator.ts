import { IDeserializedResponse, IDeserializedToken, IHttp, IJwt, ITokenStorage, noop } from '@santech/core';
import { IAuthenticateParams, IAuthenticatorEndPoints, IJwtDto, TTokenRecoveryPromise } from './models';

export interface IAuthenticator {
  readonly waitForLogin: Promise<TTokenRecoveryPromise>;
  readonly jwt: IDeserializedToken;
  readonly token: string;
  authenticate(params: IAuthenticateParams): Promise<void>;
  tryAuthenticate(jwt: IJwtDto): Promise<void>;
  renewToken(): Promise<void>;
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

  private _tokenRenewer: void | undefined | NodeJS.Timeout;
  private _token: string | undefined;
  private _http: IHttp;
  private _jwt: IJwt;
  private _storage: ITokenStorage;
  private _endPoints: IAuthenticatorEndPoints;
  private _waitForLogin: Promise<TTokenRecoveryPromise>;

  constructor(http: IHttp, storage: ITokenStorage, jwt: IJwt, endPoints: IAuthenticatorEndPoints) {
    this._http = http;
    this._storage = storage;
    this._jwt = jwt;
    this._endPoints = endPoints;
    this._waitForLogin = this._tryRetrievePreviousSession((token) => this._cacheToken(token));
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
  public authenticate(params: IAuthenticateParams): Promise<void> {
    const deviceName = (typeof navigator !== 'undefined' && navigator.userAgent)
      ? navigator.userAgent
      : 'no user agent';

    return this._login(() => this._http
      .post(this._endPoints.authenticateEndPoint, {
        deviceName,
        ...params,
      }));
  }

  /**
   * @description Try authenticate for recovered Jwt or for given Jwt
   */
  public async tryAuthenticate(jwt?: IJwtDto): Promise<void> {
    if (jwt) {
      await this._storeJwt(jwt);
    }
    const promise = this._waitForLogin = this
      ._tryRetrievePreviousSession(jwt ? (token) => this._cacheToken(token) : noop);
    try {
      const resp = await promise;
      if (resp) {
        throw resp;
      }
    } catch (e) {
      throw e;
    }
  }

  /**
   * @description Force token renew (called automatically before token expires)
   */
  public renewToken(): Promise<void> {
    return this._login(() => this._http
      .get(this._endPoints.renewEndPoint));
  }

  /**
   * @description Returns the API Authorization Header
   */
  public getAuthorizationHeader(): string {
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
    this._token = '';
    Authenticator._logoutHooks.forEach((cb) => cb());
  }

  private async _login(request: () => Promise<IDeserializedResponse<IJwtDto>>): Promise<void> {
    const { data: jwt } = await request();
    await this._storeJwt(jwt);
    return this._cacheToken(jwt.idToken);
  }

  private async _tryRetrievePreviousSession(cb?: (token: string) => void): Promise<TTokenRecoveryPromise> {
    try {
      const token = await this._tryRetrieveJwt();
      const expirationDate = this._jwt.getExpirationDate(token);
      if (!!expirationDate && expirationDate > new Date()) {
        return (cb || noop)(token);
      }
      throw new Error('token expired');
    } catch {
      return this._tryCreateDeviceSession();
    }
  }

  private async _tryCreateDeviceSession(): Promise<TTokenRecoveryPromise> {
    try {
      const userToken = await this._tryRetrieveDeviceToken();
      return this._renewUserToken(userToken);
    } catch {
      this._token = '';
    }
  }

  private async _renewUserToken(userToken: string) {
    try {
      await this._login(() => this._http
        .post(this._endPoints.authenticateEndPoint, {
          userToken,
        }));
    } catch (res) {
      this._token = '';
      return res;
    }
  }

  private _tryRetrieveJwt(): Promise<string> {
    try {
      return Promise.resolve<string>(this._storage.getJwt());
    } catch (e) {
      return Promise.reject<typeof e>(e);
    }
  }

  private _tryRetrieveDeviceToken(): Promise<string> {
    try {
      return Promise.resolve<string>(this._storage.getDeviceToken());
    } catch (e) {
      return Promise.reject<typeof e>(e);
    }
  }

  private async _storeJwt(jwt: IJwtDto) {
    const storePromises = [
      Promise.resolve((this._storage.setJwt(jwt.idToken))),
    ];
    if (jwt.userToken) {
      storePromises
        .push(Promise.resolve((this._storage.setDeviceToken((jwt.userToken)))));
    }
    await Promise.all(storePromises);
    return jwt;
  }

  private _cacheToken(token: string) {
    this._token = token;
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
}
