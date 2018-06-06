export interface ITokenStorage {
  setJwt(jwt: string): void | Promise<void>;
  setItem(key: string, item: string): void | Promise<void>;
  setDeviceToken(token: string): void | Promise<void>;
  getJwt(): string | Promise<string>;
  getItem(key: string): string | Promise<string>;
  getDeviceToken(): string | Promise<string>;
  removeJwt(): void | Promise<void>;
  removeItem(key: string): void | Promise<void>;
  removeDeviceToken(): void | Promise<void>;
}

export interface IAuthKeys {
  authKey: string;
  deviceKey: string;
}

export class TokenStorage implements ITokenStorage {
  private _storage: Storage;
  private _authKey: string;
  private _deviceKey: string;
  private _keys: IAuthKeys;

  constructor(storage: Storage, keys: IAuthKeys) {
    const { authKey, deviceKey } = keys;
    this._keys = keys;
    this._storage = storage;
    this._authKey = authKey;
    this._deviceKey = deviceKey;
  }

  public useDifferentKey(otherAuthKey: string, otherDeviceKey?: string) {
    this._authKey = otherAuthKey;
    this._deviceKey = otherDeviceKey || this._deviceKey;
  }

  public resetKeys() {
    const { authKey, deviceKey } = this._keys;
    this._authKey = authKey;
    this._deviceKey = deviceKey;
  }

  public useOtherBrowserStorage(storage: Storage) {
    this._storage = storage;
  }

  public setJwt(jwt: string) {
    this._storage.setItem(this._authKey, jwt);
  }

  public setItem(key: string, item: string) {
    this._storage.setItem(key, item);
  }

  public setDeviceToken(token: string) {
    this._storage.setItem(this._deviceKey, token);
  }

  public getJwt() {
    const jwt = this._storage.getItem(this._authKey) as string | null;
    if (!jwt) {
      throw new Error('Not logged in');
    }
    return jwt;
  }

  public getItem(key: string) {
    const item = this._storage.getItem(key);
    if (!item) {
      throw new Error('No item for key '.concat(key));
    }
    return item;
  }

  public getDeviceToken() {
    const token = this._storage.getItem(this._deviceKey) as string | null;
    if (!token) {
      throw new Error('No device token');
    }
    return token;
  }

  public removeJwt() {
    this._storage.removeItem(this._authKey);
  }

  public removeItem(key: string) {
    this._storage.removeItem(key);
  }

  public removeDeviceToken() {
    this._storage.removeItem(this._deviceKey);
  }
}
