import { Http, JsonDeserializer } from '@santech/core';
import { failure, success } from '@santech/core/testing';
import * as sinon from 'sinon';
import { Authenticator } from '../authenticator';
import { AuthorizationInterceptor } from './authorization.interceptor';

const publicEndPoint = 'url/to/publicapi';
const privateEndPoint = 'url/to/privateapi';
const token = 'Bearer token';
// tslint:disable-next-line:no-var-requires
const headers: typeof Headers = require('fetch-headers');
const client = sinon.stub() as typeof fetch & sinon.SinonStub;
const authenticatorStub = sinon.createStubInstance(Authenticator) as
  sinon.SinonStubbedInstance<Authenticator> & Authenticator;

describe('AuthorizationInterceptor', () => {
  let http: Http;

  beforeEach(() => {
    client.reset();
    authenticatorStub.isLogged.reset();
    const interceptors = [new AuthorizationInterceptor(authenticatorStub, { publicEndPoint })];
    const deserializers = [new JsonDeserializer()];
    http = new Http({ client, headers, interceptors, deserializers });
  });

  describe('When I am not logged in', () => {
    beforeEach(() => authenticatorStub.isLogged.returns(false));

    describe('And I make a public api call', () => {
      beforeEach(() => client
        .withArgs(publicEndPoint, { headers: new headers() })
        .returns(Promise.resolve(success({ public: true }))));

      it('Should not add authorization header', async () => {
        const resp = await http.get(publicEndPoint);
        expect(resp.data).toEqual({ public: true });
      });
    });

    describe('And I make a private api call', () => {
      beforeEach(() => client
        .withArgs(privateEndPoint, { headers: new headers() })
        .returns(Promise.resolve(failure({ public: false }))));

      it('Should not add authorization header', async () => {
        try {
          await http.get(privateEndPoint);
        } catch (resp) {
          expect(resp.data).toEqual({ public: false });
        }
      });
    });
  });

  describe('When I am logged in', () => {
    beforeEach(() => {
      authenticatorStub.isLogged.returns(true);
      authenticatorStub.getAuthorizationHeader.returns(token);
    });

    describe('And I make a public api call', () => {
      beforeEach(() => client
        .withArgs(publicEndPoint, { headers: new headers() })
        .returns(Promise.resolve(success({ public: true }))));

      it('Should not add authorization header', async () => {
        const resp = await http.get(publicEndPoint);
        expect(resp.data).toEqual({ public: true });
      });
    });

    describe('And I make a private api call', () => {
      beforeEach(() => client
        .withArgs(privateEndPoint, {
          headers: new headers({
            Authorization: token,
          }),
        })
        .returns(Promise.resolve(success({ private: true }))));

      it('Should add authorization header', async () => {
        const resp = await http.get(privateEndPoint);
        expect(resp.data).toEqual({ private: true });
      });
    });
  });
});
