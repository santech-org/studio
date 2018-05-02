import { Jwt } from './jwt';

const atob = (str: string) => new Buffer(str, 'base64').toString();
const btoa = (str: string) => new Buffer(str).toString('base64');
const encodeData = (data: any) => btoa(JSON.stringify(data)).replace(/=+$/, '').replace(/\+/, '-').replace(/\//g, '_');
const tokenBody = { foo: 'bar' };
const nowSeconds = Math.floor(Date.now() / 1000);
const expirationTokenBody = { exp: nowSeconds + 3600 }; // now + 1H
const token = ['tokenHeader', encodeData(tokenBody)].join('.');
const expirationToken = ['tokenHeader', encodeData(expirationTokenBody)].join('.');

describe('Jwt', () => {
  let jwt: Jwt;

  beforeEach(() => jwt = new Jwt(atob));

  describe('When deserialize a token', () => {
    it('Should return data', () => {
      expect(jwt.deserializeToken(token)).toEqual(tokenBody);
    });
  });

  describe('When token is invalid', () => {
    it('Should throw', () => {
      expect(() => jwt.deserializeToken('token')).toThrow();
    });
  });

  describe('When ask for expiration Date', () => {
    it('Sould return null if no expiration Date', () => {
      expect(jwt.getExpirationDate(token)).toBeUndefined();
    });

    it('Should return expiration Date if exists', () => {
      expect(jwt.getExpirationDate(expirationToken)).toEqual(new Date((nowSeconds + 3600) * 1000));
    });
  });
});
