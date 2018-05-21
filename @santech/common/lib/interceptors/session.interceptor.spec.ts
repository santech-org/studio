import { Http, JsonDeserializer } from '@santech/core';
import { failure, success } from '@santech/core/testing';
import * as sinon from 'sinon';
import { Authenticator } from '../authenticator';
import { SessionInterceptor } from './session.interceptor';

const publicEndPoint = 'url/to/publicapi';
const privateEndPoint = 'url/to/privateapi';
// tslint:disable-next-line:no-var-requires
const headers: typeof Headers = require('fetch-headers');
const client = sinon.stub() as typeof fetch & sinon.SinonStub;
const authenticatorStub = sinon.createStubInstance(Authenticator) as
  sinon.SinonStubbedInstance<Authenticator> & Authenticator;

describe('SessionInterceptor', () => {
  let http: Http;

  beforeEach(() => {
    client.reset();
    authenticatorStub.tryAuthenticate.reset();
    const interceptors = [new SessionInterceptor(authenticatorStub, { publicEndPoint })];
    const deserializers = [new JsonDeserializer()];
    http = new Http({ client, headers, interceptors, deserializers });
  });

  describe('When I make a public api call', () => {
    beforeEach(() => client
      .withArgs(publicEndPoint, { headers: new headers() })
      .returns(Promise.resolve(success({ public: true }))));

    it('Should not try to authenticate', async () => {
      const resp = await http.get(publicEndPoint);
      expect(resp.data).toEqual({ public: true });
      expect(authenticatorStub.tryAuthenticate.called).toBe(false);
    });
  });

  describe('When I make a private api call', () => {
    beforeEach(() => client
      .withArgs(privateEndPoint, { headers: new headers() })
      .returns(Promise.resolve(failure({ public: false }))));

    it('Should try to authenticate', async () => {
      try {
        await http.get(privateEndPoint);
      } catch (resp) {
        expect(resp.data).toEqual({ public: false });
        expect(authenticatorStub.tryAuthenticate.called).toBe(true);
      }
    });
  });
});
