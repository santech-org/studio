import {
  Http,
  IDeserializedResponse,
  IError,
  JsonDeserializer,
  JsonRequestInterceptor,
  Jwt,
  TokenStorage,
} from '@santech/core';
import { conflict, failure, internalServerError, success, unauthorized } from '@santech/core/testing';
import sinon = require('sinon');
import { Authenticator } from './authenticator';
import { HttpErrorInterceptor } from './interceptors/http-error.interceptor';

const idToken = 'clmqsdkjflsdkhfoqjidsgfvpçGH';
const userToken = 'dffjkqdsmfohefjqzefdshfgsdflkpqzehfizehf';
const publicEndPoint = 'url/to/authenticator/publicapi';
const endPoint = 'url/to/authenticator/api';
const renewEndPoint = 'url/to/authenticator/api/renew';
const authenticateEndPoint = 'url/to/authenticator/publicapi/authenticate';
const login = 'login';
const password = 'password';
const rememberMe = false;
const duration = 3000;
const deviceName = (navigator && navigator.userAgent) ? navigator.userAgent : 'no user agent';

// tslint:disable-next-line:no-var-requires
const headers: typeof Headers = require('fetch-headers');
const client = sinon.stub() as typeof fetch & sinon.SinonStub;
const interceptors = [new JsonRequestInterceptor(), new HttpErrorInterceptor()];
const deserializers = [new JsonDeserializer()];
let jwtStub: sinon.SinonStubbedInstance<Jwt> & Jwt;
let storageStub: sinon.SinonStubbedInstance<TokenStorage> & TokenStorage;

describe('Authenticator', () => {
  let http: Http;
  let service: Authenticator;

  beforeEach(() => {
    client.reset();
    storageStub = sinon.createStubInstance(TokenStorage) as sinon.SinonStubbedInstance<TokenStorage> & TokenStorage;
    storageStub.getJwt.throws('Not loggged in');
    storageStub.getDeviceToken.throws('No device token');

    jwtStub = sinon.createStubInstance(Jwt) as sinon.SinonStubbedInstance<Jwt> & Jwt;
    // Default expiration is 1H
    jwtStub.getExpirationDate
      .returns(new Date(Date.now() + 3600 * 1000));

    http = new Http({
      client,
      deserializers,
      headers,
      interceptors,
    });

    service = new Authenticator(http, storageStub, jwtStub, {
      authenticateEndPoint,
      endPoint,
      publicEndPoint,
      renewEndPoint,
    });
  });

  // Clear all timeouts
  afterEach(() => service.logout());

  describe('When already logged in', () => {
    beforeEach(() => {
      storageStub.getJwt.returns(idToken);
      service = new Authenticator(http, storageStub, jwtStub, {
        authenticateEndPoint,
        endPoint,
        publicEndPoint,
        renewEndPoint,
      });
    });

    it('Should be logged in', async () => {
      const res = await service.waitForLogin;
      expect(res).toBeUndefined();
      expect(service.isLogged()).toBe(true);
    });
  });

  describe('When already logged in with an expired token', () => {
    beforeEach(() => {
      storageStub.getJwt.returns(idToken);
      jwtStub.getExpirationDate
        .returns(new Date(Date.now() - 3600 * 1000));
      service = new Authenticator(http, storageStub, jwtStub, {
        authenticateEndPoint,
        endPoint,
        publicEndPoint,
        renewEndPoint,
      });
    });

    it('Should not be logged in', async () => {
      const res = await service.waitForLogin;
      expect(res).toBeUndefined();
      expect(service.isLogged()).toBe(false);
    });
  });

  describe('When already logged in with an expired token but a device token', () => {
    beforeEach(() => {
      storageStub.getJwt.returns(idToken);
      storageStub.getDeviceToken.returns(userToken);
      jwtStub.getExpirationDate
        .returns(new Date(Date.now() - 3600 * 1000));
      client
        .withArgs(authenticateEndPoint, {
          body: JSON.stringify({
            userToken,
          }),
          headers: new headers({
            'content-type': 'application/json',
          }),
          method: 'POST',
        })
        .returns(Promise.resolve(success({ idToken })));
      service = new Authenticator(http, storageStub, jwtStub, {
        authenticateEndPoint,
        endPoint,
        publicEndPoint,
        renewEndPoint,
      });
    });

    it('Should be logged in', async () => {
      const res = await service.waitForLogin;
      expect(res).toBeUndefined();
      expect(service.isLogged()).toBe(true);
    });

    describe('When not logged in but a device remember me token', () => {
      beforeEach(() => {
        storageStub.getDeviceToken.returns(userToken);
        client
          .withArgs(authenticateEndPoint, {
            body: JSON.stringify({
              userToken,
            }),
            headers: new headers({
              'content-type': 'application/json',
            }),
            method: 'POST',
          })
          .returns(Promise.resolve(success({ idToken })));
        service = new Authenticator(http, storageStub, jwtStub, {
          authenticateEndPoint,
          endPoint,
          publicEndPoint,
          renewEndPoint,
        });
      });

      it('Should be logged in', async () => {
        const res = await service.waitForLogin;
        expect(res).toBeUndefined();
        expect(service.isLogged()).toBe(true);
      });
    });
  });

  describe('When not logged in but a device remember me token and the server is down', () => {
    beforeEach(() => {
      storageStub.getDeviceToken.returns(userToken);
      client
        .withArgs(authenticateEndPoint, {
          body: JSON.stringify({
            userToken,
          }),
          headers: new headers({
            'content-type': 'application/json',
          }),
          method: 'POST',
        })
        .returns(Promise.resolve(failure(internalServerError)));
      service = new Authenticator(http, storageStub, jwtStub, {
        authenticateEndPoint,
        endPoint,
        publicEndPoint,
        renewEndPoint,
      });
    });

    it('Should not be logged in and return error', async () => {
      const res = await service.waitForLogin as IDeserializedResponse<IError>;
      expect(res).not.toBeUndefined();
      expect(res.data).toEqual({
        body: internalServerError,
        code: 500,
        error: 'error.internalServerError',
      });
      expect(service.isLogged()).toBe(false);
    });
  });

  describe('When authenticate', () => {
    beforeEach(() => client
      .withArgs(authenticateEndPoint, {
        body: JSON.stringify({
          deviceName,
          login,
          password,
          rememberMe,
        }),
        headers: new headers({
          'content-type': 'application/json',
        }),
        method: 'POST',
      })
      .returns(Promise.resolve(success({ idToken }))));

    it('Should authenticate', async () => {
      await service.authenticate({
        login,
        password,
        rememberMe,
      });
      expect(service.isLogged()).toBe(true);
      expect(service.getAuthorizationHeader()).toEqual('Bearer '.concat(idToken));
    });

    describe('And again', () => {
      const newToken = 'new'.concat(idToken);

      beforeEach(() => {
        client
          .withArgs(authenticateEndPoint, {
            body: JSON.stringify({
              deviceName,
              login,
              password,
              rememberMe,
            }),
            headers: new headers({
              'content-type': 'application/json',
            }),
            method: 'POST',
          })
          .returns(Promise.resolve(success({ idToken: newToken })));
        return service.authenticate({
          login,
          password,
          rememberMe,
        });
      });

      it('Should renew token', async () => {
        await service.authenticate({
          login,
          password,
          rememberMe,
        });
        expect(service.isLogged()).toBe(true);
        expect(service.getAuthorizationHeader()).toEqual('Bearer '.concat(newToken));
      });
    });

    describe('And logout', () => {
      beforeEach(() => service.logout());

      it('Should logout', () => {
        expect(service.isLogged()).toBe(false);
      });
    });
  });

  describe('When authenticate with rememberMe', () => {
    beforeEach(() => client
      .withArgs(authenticateEndPoint, {
        body: JSON.stringify({
          deviceName,
          login,
          password,
          rememberMe,
        }),
        headers: new headers({
          'content-type': 'application/json',
        }),
        method: 'POST',
      })
      .returns(Promise.resolve(success({ idToken, userToken }))));

    it('Should store the user token', async () => {
      await service.authenticate({
        login,
        password,
        rememberMe,
      });
      expect(storageStub.setDeviceToken.calledWith(userToken)).toBe(true);
      expect(service.isLogged()).toBe(true);
    });
  });

  describe('When authenticate with duration', () => {
    beforeEach(() => client
      .withArgs(authenticateEndPoint, {
        body: JSON.stringify({
          deviceName,
          duration,
          login,
          password,
          rememberMe,
        }),
        headers: new headers({
          'content-type': 'application/json',
        }),
        method: 'POST',
      })
      .returns(Promise.resolve(success({ idToken, userToken }))));

    it('Should call with the parameter', async () => {
      await service.authenticate({
        duration,
        login,
        password,
        rememberMe,
      });
      expect(service.isLogged()).toBe(true);
    });
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
      beforeEach(() => client
        .withArgs(authenticateEndPoint, {
          body: JSON.stringify({
            deviceName: 'no user agent',
            login,
            password,
            rememberMe,
          }),
          headers: new headers({
            'content-type': 'application/json',
          }),
          method: 'POST',
        })
        .returns(Promise.resolve(success({ idToken, userToken }))));

      it('Should authenticate with no user agent', async () => {
        await service.authenticate({
          login,
          password,
          rememberMe,
        });
        expect(service.isLogged()).toBe(true);
      });
    });
  });

  describe('When bad credentials', () => {
    beforeEach(() => client
      .withArgs(authenticateEndPoint, {
        body: JSON.stringify({
          deviceName,
          login,
          password,
          rememberMe,
        }),
        headers: new headers({
          'content-type': 'application/json',
        }),
        method: 'POST',
      })
      .returns(Promise.resolve(failure(unauthorized, {
        status: 401,
      }))));

    it('Should wrap error', async () => {
      try {
        await service.authenticate({
          login,
          password,
          rememberMe,
        });
      } catch (res) {
        expect(service.isLogged()).toBe(false);
        expect(res.data).toEqual({
          body: unauthorized,
          code: 401,
          error: 'error.unauthorized',
        });
      }
    });
  });

  describe('When account locked', () => {
    beforeEach(() => client
      .withArgs(authenticateEndPoint, {
        body: JSON.stringify({
          deviceName,
          login,
          password,
          rememberMe,
        }),
        headers: new headers({
          'content-type': 'application/json',
        }),
        method: 'POST',
      })
      .returns(Promise.resolve(failure(conflict, {
        status: 409,
      }))));

    it('Should wrap error', async () => {
      try {
        await service.authenticate({
          login,
          password,
          rememberMe,
        });
      } catch (res) {
        expect(service.isLogged()).toBe(false);
        expect(res.data).toEqual({
          body: conflict,
          code: 409,
          error: 'error.conflict',
        });
      }
    });
  });

  describe('When internal server error', () => {
    beforeEach(() => client
      .withArgs(authenticateEndPoint, {
        body: JSON.stringify({
          deviceName,
          login,
          password,
          rememberMe,
        }),
        headers: new headers({
          'content-type': 'application/json',
        }),
        method: 'POST',
      })
      .returns(Promise.resolve(failure(internalServerError))));

    it('Should wrap error', async () => {
      try {
        await service.authenticate({
          login,
          password,
          rememberMe,
        });
      } catch (res) {
        expect(service.isLogged()).toBe(false);
        expect(res.data).toEqual({
          body: internalServerError,
          code: 500,
          error: 'error.internalServerError',
        });
      }
    });
  });

  describe('When my token comes to expiration', () => {
    let clock: sinon.SinonFakeTimers;
    let spy: sinon.SinonStub;

    beforeEach(async () => {
      clock = sinon.useFakeTimers({
        now: Date.now(),
      });
      storageStub.getJwt.returns(idToken);
      spy = sinon.stub(http, 'get')
        .withArgs(renewEndPoint)
        .returns(Promise.resolve(success({ idToken: 'new Token' })));
      service = new Authenticator(http, storageStub, jwtStub, {
        authenticateEndPoint,
        endPoint,
        publicEndPoint,
        renewEndPoint,
      });
      await service.waitForLogin;
    });

    afterEach(() => clock.restore());

    it('Should automatically renew my token', () => {
      expect(spy.calledWith(renewEndPoint)).toBe(false);
      clock.tick(3600 * 1000 + 1);
      expect(spy.called).toBe(true);
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

  describe('When I need to authenticate with a Jwt', () => {
    beforeEach(() => {
      storageStub.setJwt.withArgs(idToken).callsFake(() => storageStub.getJwt.returns(idToken));
      return service.tryAuthenticate({ idToken });
    });

    it('Should log me in', () => {
      expect(service.isLogged()).toBe(true);
    });

    describe('And jwt is expired', () => {
      beforeEach(() => {
        jwtStub.getExpirationDate
          .returns(new Date(Date.now() - 3600 * 1000));
        storageStub.setJwt
          .withArgs(idToken)
          .callsFake(() => storageStub.getJwt.returns(idToken));
        return service.tryAuthenticate({ idToken });
      });

      it('Should not log me in', () => {
        expect(service.isLogged()).toBe(false);
      });

      describe('And I have a user token', () => {
        beforeEach(() => {
          jwtStub.getExpirationDate
            .onCall(1)
            .returns(new Date(Date.now() + 3600 * 1000));
          storageStub.setDeviceToken
            .withArgs(userToken)
            .callsFake(() => storageStub.getDeviceToken.returns(userToken));
          client
            .withArgs(authenticateEndPoint, {
              body: JSON.stringify({
                userToken,
              }),
              headers: new headers({
                'content-type': 'application/json',
              }),
              method: 'POST',
            })
            .returns(Promise.resolve(success({ idToken })));
          return service.tryAuthenticate({ idToken, userToken });
        });

        it('Should log me in', () => {
          expect(service.isLogged()).toBe(true);
        });
      });
    });
  });

  describe('When I need to recover my session', () => {
    describe('And not logged in', () => {
      it('Should reject with no Error', async () => {
        try {
          await service.tryAuthenticate();
        } catch (e) {
          expect(e).toBeUndefined();
        }
      });
    });

    describe('And not logged in but a device token', () => {
      beforeEach(() => {
        storageStub.getDeviceToken.returns(userToken);
        client
          .withArgs(authenticateEndPoint, {
            body: JSON.stringify({
              userToken,
            }),
            headers: new headers({
              'content-type': 'application/json',
            }),
            method: 'POST',
          })
          .returns(Promise.resolve(success({ idToken })));
      });

      it('Should resolve void', async () => {
        const res = await service.tryAuthenticate();
        expect(res).toBeUndefined();
      });
    });

    describe('And not logged in but a device token and server down', () => {
      beforeEach(() => {
        storageStub.getDeviceToken.returns(userToken);
        client
          .withArgs(authenticateEndPoint, {
            body: JSON.stringify({
              userToken,
            }),
            headers: new headers({
              'content-type': 'application/json',
            }),
            method: 'POST',
          })
          .returns(Promise.resolve(failure(internalServerError)));
      });

      it('Should reject with no Error', async () => {
        try {
          await service.tryAuthenticate();
        } catch (res) {
          expect(res).not.toBeUndefined();
          expect(res.data).toEqual({
            body: internalServerError,
            code: 500,
            error: 'error.internalServerError',
          });
        }
      });
    });

    describe('And logged in', () => {
      let stub: jest.SpyInstance;

      beforeEach(() => {
        stub = jest.spyOn(window, 'setTimeout');
        storageStub.getJwt.returns(idToken);
        service = new Authenticator(http, storageStub, jwtStub, {
          authenticateEndPoint,
          endPoint,
          publicEndPoint,
          renewEndPoint,
        });
      });

      afterEach(() => stub.mockRestore());

      it('Should not register token renewer', async () => {
        expect(window.setTimeout).toHaveBeenCalledTimes(1);
        stub.mockReset();
        await service.tryAuthenticate();
        expect(window.setTimeout).not.toHaveBeenCalled();
      });
    });
  });

  describe('When logout', () => {
    it('Should not throw', () => {
      expect(() => service.logout()).not.toThrow();
    });
  });
});
