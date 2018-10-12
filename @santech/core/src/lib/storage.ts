export interface ITokenStorage {
  useDifferentKey(keys: IStorageKeys): void;
  resetKeys(): void;
  useOtherBrowserStorage(storage: Storage): void;
  setItem(data: IStorageData): void | Promise<void>;
  getItem(key: string): string | Promise<string>;
  removeItem(key: string): void | Promise<void>;
}

export interface IStorageKeys {
  [key: string]: string;
}

export interface IStorageData {
  [key: string]: string;
}

export class TokenStorage implements ITokenStorage {
  private _storage: Storage;
  private _intialKeys: IStorageKeys;
  private _keys: IStorageKeys;

  constructor(storage: Storage, keys: IStorageKeys) {
    this._keys = this._intialKeys = keys;
    this._storage = storage;
  }

  public useDifferentKey(keys: IStorageKeys) {
    this._keys = keys;
  }

  public resetKeys() {
    this._keys = this._intialKeys;
  }

  public useOtherBrowserStorage(storage: Storage) {
    this._storage = storage;
  }

  public setItem(data: IStorageData) {
    const storage = this._storage;
    const keys = this._keys;
    Object.keys(data).forEach((k) => storage.setItem(keys[k], data[k]));
  }

  public getItem(key: string) {
    const item = this._storage.getItem(key);
    if (!item) {
      throw new Error('No item for key '.concat(key));
    }
    return item;
  }

  public removeItem(key: string) {
    this._storage.removeItem(key);
  }
}
