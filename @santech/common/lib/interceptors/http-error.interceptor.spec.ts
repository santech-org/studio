import { Http, JsonDeserializer } from '@santech/core';
import {
  accessDenied,
  badRequest,
  conflict,
  failure,
  internalServerError,
  locked,
  notFound,
  success,
  unauthorized,
} from '@santech/core/testing';
import * as sinon from 'sinon';
import { HttpErrorInterceptor } from './http-error.interceptor';

const url = 'url/to/api';
// tslint:disable-next-line:no-var-requires
const headers: typeof Headers = require('fetch-headers');
const client = sinon.stub() as typeof fetch & sinon.SinonStub;

describe('HttpErrorInterceptor', () => {
  let http: Http;

  beforeEach(() => {
    client.reset();
    const interceptors = [new HttpErrorInterceptor()];
    const deserializers = [new JsonDeserializer()];
    http = new Http({ client, headers, interceptors, deserializers });
  });

  describe('When my http request does not fail', () => {
    beforeEach(() => client
      .withArgs(url, { headers: new headers() })
      .returns(Promise.resolve(success({}))));

    it('Should not map the error', async () => {
      const res = await http.get(url);
      expect(res.data).toEqual({});
    });
  });

  describe('When my http request fails', () => {
    describe('And bad request', () => {
      beforeEach(() => client
        .withArgs(url, { headers: new headers() })
        .returns(Promise.resolve(failure(badRequest, { status: 400 }))));

      it('Should map the error', async () => {
        try {
          await http.get(url);
        } catch (res) {
          expect(res.data).toEqual({
            code: 400,
            error: 'error.badRequest',
          });
        }
      });
    });

    describe('And unauthorized', () => {
      beforeEach(() => client
        .withArgs(url, { headers: new headers() })
        .returns(Promise.resolve(failure(unauthorized, { status: 401 }))));

      it('Should map the error', async () => {
        try {
          await http.get(url);
        } catch (res) {
          expect(res.data).toEqual({
            code: 401,
            error: 'error.unauthorized',
          });
        }
      });
    });

    describe('And access denied', () => {
      beforeEach(() => client
        .withArgs(url, { headers: new headers() })
        .returns(Promise.resolve(failure(accessDenied, { status: 403 }))));

      it('Should map the error', async () => {
        try {
          await http.get(url);
        } catch (res) {
          expect(res.data).toEqual({
            code: 403,
            error: 'error.accessDenied',
          });
        }
      });
    });

    describe('And not found', () => {
      beforeEach(() => client
        .withArgs(url, { headers: new headers() })
        .returns(Promise.resolve(failure(notFound, { status: 404 }))));

      it('Should map the error', async () => {
        try {
          await http.get(url);
        } catch (res) {
          expect(res.data).toEqual({
            code: 404,
            error: 'error.notFound',
          });
        }
      });
    });

    describe('And conflict', () => {
      beforeEach(() => client
        .withArgs(url, { headers: new headers() })
        .returns(Promise.resolve(failure(conflict, { status: 409 }))));

      it('Should map the error', async () => {
        try {
          await http.get(url);
        } catch (res) {
          expect(res.data).toEqual({
            code: 409,
            error: 'error.conflict',
          });
        }
      });
    });

    describe('And locked', () => {
      beforeEach(() => client
        .withArgs(url, { headers: new headers() })
        .returns(Promise.resolve(failure(locked, { status: 423 }))));

      it('Should map the error', async () => {
        try {
          await http.get(url);
        } catch (res) {
          expect(res.data).toEqual({
            code: 423,
            error: 'error.locked',
          });
        }
      });
    });

    describe('And internal server error', () => {
      beforeEach(() => client
        .withArgs(url, { headers: new headers() })
        .returns(Promise.resolve(failure(internalServerError))));

      it('Should map the error', async () => {
        try {
          await http.get(url);
        } catch (res) {
          expect(res.data).toEqual({
            code: 500,
            error: 'error.internalServerError',
          });
        }
      });
    });

    describe('And unknown', () => {
      beforeEach(() => client
        .withArgs(url, { headers: new headers() })
        .returns(Promise.resolve(failure(internalServerError, { status: 1000 }))));

      it('Should map the error', async () => {
        try {
          await http.get(url);
        } catch (res) {
          expect(res.data).toEqual({
            code: 0,
            error: 'unknown',
          });
        }
      });
    });
  });
});
