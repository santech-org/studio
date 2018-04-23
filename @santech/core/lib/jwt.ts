import { IDeserializedToken } from './models';

const base64urlSpecRegexs = [/-/g, /_/g];

export interface IJwt {
  deserializeToken<T extends IDeserializedToken>(jwt: string): T;
  getExpirationDate(jwt: string): Date | undefined;
}

export class Jwt implements IJwt {
  private _decode: typeof atob;

  constructor(decoder: typeof atob) {
    this._decode = this._setDecoder(decoder);
  }

  public deserializeToken<T extends IDeserializedToken>(jwt: string) {
    return JSON.parse(this._decode(jwt
      .split('.')[1]
      .replace(base64urlSpecRegexs[0], '+')
      .replace(base64urlSpecRegexs[1], '/'))) as T;
  }

  public getExpirationDate(jwt: string) {
    let expirationDate: Date | undefined;
    const token = this.deserializeToken<IDeserializedToken>(jwt);
    if (typeof token.exp === 'number') {
      expirationDate = new Date(0);
      expirationDate.setUTCSeconds(token.exp);
    }
    return expirationDate;
  }

  private _setDecoder(decoder: typeof atob) {
    return (encodedString: string) => decoder(encodedString);
  }
}
