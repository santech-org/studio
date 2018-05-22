import { Http, JsonDeserializer } from '@santech/core';
import { badRequest, failure, internalServerError } from '@santech/core/testing';
import * as sinon from 'sinon';
import { HttpStatusInterceptor } from './http-status.interceptor';

const publicEndPoint = 'url/to/publicapi';
const privateEndPoint = 'url/to/privateapi';
const specifiedError = 500;
const unknownError = 400;
const urlSpecifiedError = [privateEndPoint, specifiedError].join('/');
const urlUnknownError = [privateEndPoint, unknownError].join('/');
// tslint:disable-next-line:no-var-requires
const headers: typeof Headers = require('fetch-headers');
const client = sinon.stub() as typeof fetch & sinon.SinonStub;

describe('HttpStatusInterceptor', () => {
  let http: Http;
  let interceptor: HttpStatusInterceptor;

  describe('Given no public endPoint', () => {
    beforeEach(() => {
      client.reset();
      interceptor = new HttpStatusInterceptor();
      const interceptors = [interceptor];
      const deserializers = [new JsonDeserializer()];
      http = new Http({ client, headers, interceptors, deserializers });
    });

    describe('When I set a response status callback', () => {
      let errorTriggered: boolean;

      beforeEach(() => {
        errorTriggered = false;

        client
          .withArgs(urlSpecifiedError, { headers: new headers() })
          .returns(Promise.resolve(failure(internalServerError, {
            status: specifiedError,
          })));

        client
          .withArgs(urlUnknownError, { headers: new headers() })
          .returns(Promise.resolve(failure(badRequest, {
            status: unknownError,
          })));

        interceptor.setStatusCallBack('500', () => errorTriggered = true);
      });

      it('Should trigger the callback if the error matches', async () => {
        try {
          await http.get(urlSpecifiedError);
        } catch (resp) {
          expect(errorTriggered).toBe(true);
          expect(resp.status).toEqual(specifiedError);
        }
      });

      it('Should not trigger the callback if the error doesn\'t matches', async () => {
        try {
          await http.get(urlUnknownError);
        } catch (resp) {
          expect(errorTriggered).toBe(false);
          expect(resp.status).toEqual(unknownError);
        }
      });
    });

    describe('When I remove one callback', () => {
      let errorTriggered: boolean;

      beforeEach(async () => {
        errorTriggered = false;

        client
          .withArgs(privateEndPoint, { headers: new headers() })
          .returns(Promise.resolve(failure(internalServerError)));

        const remover = interceptor
          .setStatusCallBack('500', () => errorTriggered = true);

        remover();
      });

      it('Should not trigger the callback', async () => {
        try {
          await http.get(privateEndPoint);
        } catch (resp) {
          expect(errorTriggered).toBe(false);
          expect(resp.status).toEqual(500);
        }
      });
    });

    describe('When I clear one callback based on the status regex', () => {
      let errorTriggered: boolean;

      beforeEach(async () => {
        errorTriggered = false;

        client
          .withArgs(privateEndPoint, { headers: new headers() })
          .returns(Promise.resolve(failure(internalServerError)));

        interceptor
          .setStatusCallBack('500', () => errorTriggered = true);

        interceptor
          .setStatusCallBack('400', () => errorTriggered = true);

        interceptor.removeStatusCallBack('500');
      });

      it('Should not trigger the callback', async () => {
        try {
          await http.get(privateEndPoint);
        } catch (resp) {
          expect(errorTriggered).toBe(false);
          expect(resp.status).toEqual(500);
        }
      });

      describe('And no status regex', () => {
        it('Should not throw', () => {
          expect(() => interceptor.removeStatusCallBack('500')).not.toThrow();
        });
      });
    });

    describe('When I clear the callbacks', () => {
      let errorTriggered: boolean;

      beforeEach(() => {
        errorTriggered = false;

        client
          .withArgs(privateEndPoint, { headers: new headers() })
          .returns(Promise.resolve(failure(internalServerError)));

        interceptor.setStatusCallBack('500', () => errorTriggered = true);

        interceptor.clearStatusCallBacks();
      });

      it('Should not trigger the callback', async () => {
        try {
          await http.get(privateEndPoint);
        } catch (resp) {
          expect(errorTriggered).toBe(false);
          expect(resp.status).toEqual(500);
        }
      });
    });
  });

  describe('Given public endPoint', () => {
    beforeEach(() => {
      client.reset();
      interceptor = new HttpStatusInterceptor({ publicEndPoint });
      const interceptors = [interceptor];
      const deserializers = [new JsonDeserializer()];
      http = new Http({ client, headers, interceptors, deserializers });
    });

    describe('When I set a callback', () => {
      let errorTriggered: boolean;

      beforeEach(async () => {
        errorTriggered = false;

        client
          .withArgs(publicEndPoint, { headers: new headers() })
          .returns(Promise.resolve(failure(internalServerError, { url: publicEndPoint })));

        interceptor.setStatusCallBack('500', () => errorTriggered = true);
      });

      it('Should not trigger the callback', async () => {
        try {
          await http.get(publicEndPoint);
        } catch (resp) {
          expect(errorTriggered).toBe(false);
          expect(resp.status).toEqual(500);
        }
      });
    });
  });
});
