import { Http, Jwt, THttpRequestInterceptor, TokenStorage } from '@santech/core';
import { conflict, failure, internalServerError, success, unauthorized } from '@santech/core/testing';
import sinon = require('sinon');
import { Authenticator } from '..';

// No typings for fetch-headers...
// tslint:disable-next-line:no-var-requires
const headersPolyfill: typeof Headers = require('fetch-headers');

const token = 'clmqsdkjflsdkhfoqjidsgfvpçGH';
const publicEndPoint = 'url/to/authenticator/publicapi';
const endPoint = 'url/to/authenticator/api';
const renewEndPoint = 'url/to/authenticator/api/renew';
const authenticateEndPoint = 'url/to/authenticator/publicapi/authenticate';
const login = 'login';
const password = 'password';
const rememberMe = false;
const duration = 3000;
const deviceName = (navigator && navigator.userAgent) ? navigator.userAgent : 'no user agent';

let httpStub: sinon.SinonStubbedInstance<Http> & Http;
let jwtStub: sinon.SinonStubbedInstance<Jwt> & Jwt;
let storageStub: sinon.SinonStubbedInstance<TokenStorage> & TokenStorage;
let interceptorRemover: sinon.SinonStub;

describe('Authenticator', () => {
  let service: Authenticator;

  beforeEach(() => {
    interceptorRemover = sinon.stub();
    interceptorRemover.resetBehavior();

    httpStub = sinon.createStubInstance(Http) as sinon.SinonStubbedInstance<Http> & Http;
    httpStub.createHeaders = sinon.stub();

    httpStub.addRequestInterceptor.returns(interceptorRemover);

    storageStub = sinon.createStubInstance(TokenStorage) as sinon.SinonStubbedInstance<TokenStorage> & TokenStorage;
    storageStub.getJwt.throws('Not loggged in');
    storageStub.getDeviceToken.throws('No device token');

    jwtStub = sinon.createStubInstance(Jwt) as sinon.SinonStubbedInstance<Jwt> & Jwt;
    // Default expiration is 1H
    jwtStub.getExpirationDate
      .returns(new Date(Date.now() + 3600 * 1000));
  });

  beforeEach(() => {
    service = new Authenticator(httpStub, storageStub, jwtStub, {
      authenticateEndPoint,
      endPoint,
      publicEndPoint,
      renewEndPoint,
    });
    expect(service.isLogged()).toBe(false);
  });

  // Clear all timeouts
  afterEach(() => service.logout());

  describe('When logout', () => {
    it('Should not throw as no token interceptor', () => {
      expect(() => service.logout()).not.toThrow();
    });
  });

  describe('When authenticate', () => {
    beforeEach(() => {
      httpStub.post
        .withArgs(authenticateEndPoint, {
          deviceName,
          login,
          password,
          rememberMe,
        })
        .returns(Promise.resolve(success({ idToken: token })));
      return service.authenticate({
        login,
        password,
        rememberMe,
      });
    });

    it('Should authenticate', () => {
      expect(storageStub.setJwt.calledWith(token)).toBe(true);
      expect(httpStub.addRequestInterceptor.calledTwice).toBe(true);
      expect(service.isLogged()).toBe(true);
      expect(service.getAuthorizationHeader()).toEqual('Bearer '.concat(token));
    });

    describe('And set checkLogin interceptor', () => {
      describe('When logged id', () => {
        beforeEach(() => storageStub.getJwt.returns(token));

        it('Should check token expiration', () => {
          const request = { headers: [] };
          const interceptor: THttpRequestInterceptor = httpStub.addRequestInterceptor.getCall(0).args[0];
          return interceptor('url', request)
            .then((req) => {
              expect(req).toEqual(request);
              expect(httpStub.post.calledOnce).toBe(true);
              expect(httpStub.post.calledTwice).toBe(false);
            });
        });
      });

      describe('When token expired', () => {
        beforeEach(() => storageStub.getDeviceToken.returns(token));

        it('Should try to renew token with device token', () => {
          const request = { headers: [] };
          const interceptor: THttpRequestInterceptor = httpStub.addRequestInterceptor.getCall(0).args[0];
          return interceptor('url', request)
            .then((req) => {
              expect(req).toEqual(request);
              expect(httpStub.post.calledOnce).toBe(false);
              expect(httpStub.post.calledTwice).toBe(true);
            });
        });

        it('Should not intercept publicapi requests as it will log in', () => {
          const request = { headers: [] };
          const interceptor: THttpRequestInterceptor = httpStub.addRequestInterceptor.getCall(0).args[0];
          return interceptor(publicEndPoint, request)
            .then((req) => {
              expect(req).toEqual(request);
              expect(httpStub.post.calledOnce).toBe(true);
            });
        });
      });
    });

    it('Should set the jwt interceptor', () => {
      const request = { headers: new headersPolyfill() };
      httpStub.createHeaders.returns(new headersPolyfill());
      const interceptor: THttpRequestInterceptor = httpStub.addRequestInterceptor.getCall(1).args[0];
      return interceptor('url', request).then((req) => {
        expect(req).toEqual(request);
        expect(request.headers.get('Authorization')).toEqual('Bearer '.concat(token));
      });
    });

    describe('And again', () => {
      const newToken = 'new'.concat(token);

      beforeEach(() => {
        httpStub.addRequestInterceptor.resetHistory();
        httpStub.addRequestInterceptor.throws('Should not be called');
        httpStub.post
          .withArgs(authenticateEndPoint, {
            deviceName,
            login,
            password,
            rememberMe,
          })
          .returns(Promise.resolve(success({ idToken: newToken })));
        return service.authenticate({
          login,
          password,
          rememberMe,
        });
      });

      it('Should renew token', () => {
        expect(storageStub.setJwt.calledWith(newToken)).toBe(true);
        expect(httpStub.addRequestInterceptor.notCalled).toBe(true);
        expect(service.isLogged()).toBe(true);
        expect(service.getAuthorizationHeader()).toEqual('Bearer '.concat(newToken));
      });
    });

    describe('And logout', () => {
      beforeEach(() => service.logout());

      it('Should logout', () => {
        expect(storageStub.removeJwt.calledOnce).toBe(true);
        expect(storageStub.removeDeviceToken.calledOnce).toBe(true);
        expect(interceptorRemover.calledTwice).toBe(true);
        expect(service.isLogged()).toBe(false);
      });
    });
  });

  describe('When authenticate with rememberMe', () => {
    beforeEach(() => {
      httpStub.post
        .withArgs(authenticateEndPoint, {
          deviceName,
          login,
          password,
          rememberMe,
        })
        .returns(Promise.resolve(success({ idToken: token, userToken: token })));
      return service.authenticate({
        login,
        password,
        rememberMe,
      });
    });

    it('Should store the user token', () => {
      expect(storageStub.setDeviceToken.calledWith(token)).toBe(true);
    });
  });

  describe('When authenticate with duration', () => {
    beforeEach(() => {
      httpStub.post
        .withArgs(authenticateEndPoint, {
          deviceName,
          duration,
          login,
          password,
        })
        .returns(Promise.resolve(success({ idToken: token, userToken: token })));
      return service.authenticate({
        duration,
        login,
        password,
      });
    });

    it('Should call with the parameter', () => {
      expect(service.isLogged()).toBe(true);
    });
  });

  describe('When authenticate with jwt', () => {
    beforeEach(() => {
      storageStub.setJwt.withArgs(token).callsFake(() => storageStub.getJwt.returns(token));
      return service.authenticateWithJwt({ idToken: token, userToken: null });
    });

    it('Should log me in', () => {
      expect(service.isLogged()).toBe(true);
    });
  });

  describe('When authenticate with expired jwt', () => {
    beforeEach(() => {
      jwtStub.getExpirationDate.returns(new Date(Date.now() - 3600 * 1000));
      storageStub.setJwt.withArgs(token).callsFake(() => storageStub.getJwt.returns(token));
      return service.authenticateWithJwt({ idToken: token, userToken: null });
    });

    it('Should not log me in', () => {
      expect(service.isLogged()).toBe(false);
    });
  });

  describe('When authenticate with expired jwt but device token', () => {
    beforeEach((done) => {
      jwtStub.getExpirationDate.onCall(0).returns(new Date(Date.now() - 3600 * 1000));
      jwtStub.getExpirationDate.onCall(1).returns(new Date(Date.now() + 3600 * 1000));
      storageStub.setJwt.withArgs(token).callsFake(() => storageStub.getJwt.returns(token));
      storageStub.setDeviceToken.withArgs(token).callsFake(() => storageStub.getDeviceToken.returns(token));
      httpStub.post
        .withArgs(authenticateEndPoint, {
          userToken: token,
        })
        .returns(Promise.resolve(success({ idToken: token })));
      service.authenticateWithJwt({ idToken: token, userToken: token })
        .then(done);
    });

    it('Should log me in', () => {
      expect(service.isLogged()).toBe(true);
    });
  });

  describe('When no connection', () => {
    beforeEach(() => {
      httpStub.post
        .withArgs(authenticateEndPoint, {
          deviceName,
          login,
          password,
          rememberMe,
        })
        .returns(Promise.reject(new TypeError('Failed to fetch')));
    });

    it('should wrap error', () => {
      service.authenticate({
        login,
        password,
        rememberMe,
      })
        .catch((err: Error) => {
          expect(err.message).toEqual('no connection');
        });
    });
  });

  describe('When bad credentials', () => {
    beforeEach(() => {
      httpStub.post
        .withArgs(authenticateEndPoint, {
          deviceName,
          login,
          password,
          rememberMe,
        })
        .returns(Promise.reject(failure(unauthorized, {
          status: 401,
        })));
    });

    it('should wrap error', () => {
      return service.authenticate({ login, password, rememberMe })
        .catch((resp) => expect(resp).toEqual(unauthorized));
    });
  });

  describe('When account locked', () => {
    beforeEach(() => {
      httpStub.post
        .withArgs(authenticateEndPoint, {
          deviceName,
          login,
          password,
          rememberMe,
        })
        .returns(Promise.reject(failure(conflict, {
          status: 401,
        })));
    });

    it('should wrap error', () => {
      return service.authenticate({ login, password, rememberMe })
        .catch((resp) => expect(resp).toEqual(conflict));
    });
  });

  describe('When internal server error', () => {
    beforeEach(() => {
      httpStub.post
        .withArgs(authenticateEndPoint, {
          deviceName,
          login,
          password,
          rememberMe,
        })
        .returns(Promise.reject(failure({
          error: internalServerError,
        })));
    });

    it('should wrap error', () => {
      service.authenticate({
        login,
        password,
        rememberMe,
      })
        .catch((err: Error) => {
          expect(err.message).toEqual('internal server error');
        });
    });
  });

  describe('When already logged in', () => {
    beforeEach(() => {
      storageStub.getJwt.returns(token);
      service = new Authenticator(httpStub, storageStub, jwtStub, {
        authenticateEndPoint,
        endPoint,
        publicEndPoint,
        renewEndPoint,
      });
      return service.waitForLogin
        .then((err) => {
          if (err) {
            throw err;
          }
        });
    });

    it('Should be logged in', () => {
      expect(httpStub.addRequestInterceptor.calledTwice).toBe(true);
      expect(service.isLogged()).toBe(true);
    });
  });

  describe('When already logged in with an expired token', () => {
    beforeEach(() => {
      storageStub.getJwt.returns(token);
      jwtStub.getExpirationDate
        .returns(new Date(Date.now() - 3600 * 1000));
      service = new Authenticator(httpStub, storageStub, jwtStub, {
        authenticateEndPoint,
        endPoint,
        publicEndPoint,
        renewEndPoint,
      });
      return service.waitForLogin
        .then((err) => {
          if (err) {
            throw err;
          }
        });
    });

    it('Should not be logged in', () => {
      expect(service.isLogged()).toBe(false);
    });
  });

  describe('When already logged in with an expired token but a device token', () => {
    beforeEach(() => {
      storageStub.getJwt.returns(token);
      storageStub.getDeviceToken.returns(token);
      jwtStub.getExpirationDate
        .onCall(1)
        .returns(new Date(Date.now() - 3600 * 1000));
      jwtStub.getExpirationDate
        .onCall(1)
        .returns(new Date(Date.now() + 3600 * 1000));
      httpStub.post
        .withArgs(authenticateEndPoint, {
          userToken: token,
        })
        .returns(Promise.resolve(success({ idToken: token })));
      service = new Authenticator(httpStub, storageStub, jwtStub, {
        authenticateEndPoint,
        endPoint,
        publicEndPoint,
        renewEndPoint,
      });
      return service.waitForLogin
        .then((err) => {
          if (err) {
            throw err;
          }
        });
    });

    it('Should be logged in', () => {
      expect(service.isLogged()).toBe(true);
    });
  });

  describe('When not logged in but a device remember me token', () => {
    beforeEach(() => {
      storageStub.getDeviceToken.returns(token);
      httpStub.post
        .withArgs(authenticateEndPoint, {
          userToken: token,
        })
        .returns(Promise.resolve(success({ idToken: token })));
      service = new Authenticator(httpStub, storageStub, jwtStub, {
        authenticateEndPoint,
        endPoint,
        publicEndPoint,
        renewEndPoint,
      });
      return service.waitForLogin
        .then((err) => {
          if (err) {
            throw err;
          }
        });
    });

    it('Should be logged in', () => {
      expect(service.isLogged()).toBe(true);
    });
  });

  describe('When not logged in but a device remember me token and the server is down', () => {
    beforeEach(() => {
      storageStub.getDeviceToken.returns(token);
      httpStub.post
        .withArgs(authenticateEndPoint, {
          userToken: token,
        })
        .returns(Promise.reject(failure(internalServerError, { status: 500 })));
      service = new Authenticator(httpStub, storageStub, jwtStub, {
        authenticateEndPoint,
        endPoint,
        publicEndPoint,
        renewEndPoint,
      });
    });

    it('Should fail to log me and return an error', () => service.waitForLogin
      .then((err) => expect(err).not.toBeUndefined()));
  });

  describe('When my token comes to expiration', () => {
    let clock: sinon.SinonFakeTimers;

    beforeEach(() => {
      clock = sinon.useFakeTimers();
      storageStub.getJwt.returns(token);
      jwtStub.getExpirationDate.returns(new Date(Date.now() + 3600 * 1000));
      httpStub.get
        .withArgs(renewEndPoint)
        .returns(Promise.resolve(success({ idToken: 'new token' })));
      service = new Authenticator(httpStub, storageStub, jwtStub, {
        authenticateEndPoint,
        endPoint,
        publicEndPoint,
        renewEndPoint,
      });
      return service.waitForLogin
        .then((err) => {
          if (err) {
            throw err;
          }

          expect(httpStub.get.called).toBe(false);
          return clock.tick(3600 * 1000 + 1);
        });
    });

    it('Should automatically renew my token', () => {
      expect(httpStub.get.called).toBe(true);
    });

    afterEach(() => clock.restore());
  });

  describe('When global navigator does not exist', () => {
    let navigator: Navigator;

    beforeEach(() => {
      navigator = window.navigator;
      Object.defineProperty(window, 'navigator', {
        get: () => undefined,
      });
    });

    afterEach(() => Object.defineProperty(window, 'navigator', {
      get: () => navigator,
    }));

    describe('And authenticate', () => {
      beforeEach(() => {
        httpStub.post
          .withArgs(authenticateEndPoint, {
            deviceName: 'no user agent',
            login,
            password,
            rememberMe,
          })
          .returns(Promise.resolve(success({ idToken: token })));
        return service.authenticate({
          login,
          password,
          rememberMe,
        });
      });

      it('Should authenticate', () => {
        expect(service.isLogged()).toBe(true);
      });
    });
  });

  describe('When I need to retrieve connected user', () => {
    const user = {
      auth: 'auth',
      exp: Date.now(),
      sub: 'admin',
      uuid: 'uuid',
    };

    beforeEach(() => jwtStub.deserializeToken.returns(user));

    it('Should expose it', () => {
      expect(service.jwt).toEqual(user);
    });
  });

  describe('When I want to register some callback on logout', () => {
    const callback = sinon.spy();
    const remover = Authenticator.addLogoutHook(callback);

    beforeEach(() => callback.resetHistory());

    it('Should call it on logout', () => {
      service.logout();
      expect(callback.calledOnce).toBe(true);
    });

    describe('And no more', () => {
      beforeEach(() => remover());

      it('Should no more call it on logout', () => {
        service.logout();
        expect(callback.calledOnce).toBe(false);
      });

      describe('And I accidentally remove it multiple times', () => {
        const cb: () => void = () => {
          // empty
        };
        beforeEach(() => {
          Authenticator.addLogoutHook(cb);
          Authenticator.addLogoutHook(cb);
          Authenticator.addLogoutHook(cb);
          remover();
        });

        it('Should not throw or remove any callback anymore', () => {
          expect((Authenticator as any)._logoutHooks.length).toEqual(3);
        });
      });
    });
  });

  describe('When different renew endPoint', () => {
    beforeEach(() => {
      service = new Authenticator(httpStub, storageStub, jwtStub, {
        authenticateEndPoint,
        endPoint,
        publicEndPoint,
        renewEndPoint,
      });
      httpStub.get
        .withArgs(renewEndPoint)
        .returns(Promise.resolve(success({ idToken: 'new token' })));
      return service.renewToken();
    });

    it('Should use other endpoint', () => {
      expect(storageStub.setJwt.calledWith('new token')).toBe(true);
    });
  });
});
