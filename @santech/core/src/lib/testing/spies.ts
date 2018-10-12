// tslint:disable-next-line:no-implicit-dependencies
import { Http, Jwt, TokenStorage } from '@santech/core';

export type SantechSpyObject<T> = T & {
  [method in keyof T]: jasmine.Spy & jest.Mock<any>;
};

export const filterPrivate = (key: string) => {
  return !key.startsWith('_') && key !== 'constructor';
};

export const createJestSpyObj = <T>(methods: string[]): SantechSpyObject<T> => methods.reduce((p, m) => {
  p[m] = jest.fn();
  return p;
}, {} as any);

export const httpMethods = Object
  .getOwnPropertyNames(Http.prototype).filter(filterPrivate).concat('createHeaders');

export const jwtMethods = Object
  .getOwnPropertyNames(Jwt.prototype).filter(filterPrivate);

export const tokenStorageMethods = Object
  .getOwnPropertyNames(TokenStorage.prototype).filter(filterPrivate);

let spyHttp: SantechSpyObject<Http>;
let spyJwt: SantechSpyObject<Jwt>;
let spyTokenStorage: SantechSpyObject<TokenStorage>;

if (typeof jasmine !== 'undefined' && typeof jasmine.createSpyObj === 'function') {
  spyHttp = jasmine.createSpyObj('spyHttp', httpMethods);

  spyJwt = jasmine.createSpyObj('spyJwt', jwtMethods);

  spyTokenStorage = jasmine.createSpyObj('spyTokenStorage', tokenStorageMethods);
} else if (typeof jest !== 'undefined') {
  spyHttp = createJestSpyObj(httpMethods);

  spyJwt = createJestSpyObj(jwtMethods);

  spyTokenStorage = createJestSpyObj(tokenStorageMethods);
} else {
  throw new Error('@santech/core/testing: Spies are available with jasmine & jest only');
}

export {
  spyHttp,
  spyJwt,
  spyTokenStorage,
};
