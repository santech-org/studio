// tslint:disable-next-line:no-implicit-dependencies
import { Authenticator, HttpStatusInterceptor, IAuthenticateParams, Logger } from '@santech/common';
import { createJestSpyObj, filterPrivate, SantechSpyObject } from '@santech/core/testing';

export const authenticatorMethods = Object
  .getOwnPropertyNames(Authenticator.prototype).filter(filterPrivate);

export const httpStatusInterceptorMethods = Object
  .getOwnPropertyNames(HttpStatusInterceptor.prototype).filter(filterPrivate);

export const loggerMethods = Object
  .getOwnPropertyNames(Logger.prototype).filter(filterPrivate);

let spyAuthenticator: SantechSpyObject<Authenticator>;
let spyHttpStatusInterceptor: SantechSpyObject<HttpStatusInterceptor>;
let spyLogger: SantechSpyObject<Logger>;

export const authenticateImplementation = (credentials: IAuthenticateParams) => {
  if (credentials.login === 'invalid login' || credentials.password === 'invalid password') {
    return Promise.reject(new Error('bad credentials'));
  }
  return Promise.resolve();
};

if (typeof jasmine !== 'undefined' && typeof jasmine.createSpyObj === 'function') {
  spyAuthenticator = jasmine.createSpyObj('spyAuthenticator', authenticatorMethods);
  Object.defineProperty(spyAuthenticator, 'waitForLogin', {
    get: () => Promise.resolve(),
  });
  spyAuthenticator.authenticate.and.callFake(authenticateImplementation);

  spyHttpStatusInterceptor = jasmine.createSpyObj('spyHttpStatusInterceptor', httpStatusInterceptorMethods);
  spyLogger = jasmine.createSpyObj('spyLogger', loggerMethods);
} else if (typeof jest !== 'undefined') {
  spyAuthenticator = createJestSpyObj(authenticatorMethods);
  Object.defineProperty(spyAuthenticator, 'waitForLogin', {
    get: () => Promise.resolve(),
  });
  spyAuthenticator.authenticate.mockImplementation(authenticateImplementation);

  spyHttpStatusInterceptor = createJestSpyObj(httpStatusInterceptorMethods);
  spyLogger = createJestSpyObj(loggerMethods);
}

export {
  spyHttpStatusInterceptor,
  spyAuthenticator,
  spyLogger,
};
