import { Http } from '@santech/core';
import { failure, internalServerError } from '@santech/core/testing';
import sinon = require('sinon');
import { HttpErrorInterceptor } from '..';

const fetchStub = sinon.stub() as typeof fetch & sinon.SinonStub;

// No typings for fetch-headers...
// tslint:disable-next-line:no-var-requires
const headersPolyfill: typeof Headers = require('fetch-headers');

const url = 'http://host:port/path';

describe('Http error interceptor', () => {
  let http: Http;
  let httpErrorInterceptor: HttpErrorInterceptor;

  beforeEach(() => {
    fetchStub.reset();
    fetchStub.resetBehavior();
    http = new Http(fetchStub, headersPolyfill);
  });

  describe('When I set an error interceptor', () => {
    let errorTriggered: boolean;
    const specifiedError = 500;
    const unknownError = 400;
    const urlSpecifiedError = [url, specifiedError].join('/');
    const urlUnknownError = [url, unknownError].join('/');

    beforeEach(() => {
      errorTriggered = false;

      fetchStub
        .withArgs(urlSpecifiedError, { headers: new headersPolyfill() })
        .returns(Promise.resolve(failure(internalServerError, {
          status: specifiedError,
        })));

      fetchStub
        .withArgs(urlUnknownError, { headers: new headersPolyfill() })
        .returns(Promise.resolve(failure(internalServerError, {
          status: unknownError,
        })));

      httpErrorInterceptor = new HttpErrorInterceptor(http);
      httpErrorInterceptor.setErrorInterceptor('500', () => errorTriggered = true);
    });

    it('Should trigger the interceptor if the error matches', () => {
      return http.get(urlSpecifiedError)
        .catch((resp: Response) => {
          expect(errorTriggered).toBe(true);
          expect(resp.status).toEqual(specifiedError);
        });
    });

    it('Won\'t trigger the interceptor if the error doesn\'t matches', () => {
      return http.get(urlUnknownError)
        .catch((resp: Response) => {
          expect(errorTriggered).toBe(false);
          expect(resp.status).toEqual(unknownError);
        });
    });
  });

  describe('When I clear one error interceptor', () => {
    let errorTriggered: boolean;

    beforeEach(() => {
      errorTriggered = false;

      fetchStub
        .withArgs(url, { headers: new headersPolyfill() })
        .returns(Promise.resolve(failure(internalServerError)));

      httpErrorInterceptor = new HttpErrorInterceptor(http);
      httpErrorInterceptor.setErrorInterceptor('500', () => errorTriggered = true);

      httpErrorInterceptor.clearErrorInterceptor('500');
    });

    it('Should not trigger the interceptor', () => {
      return http.get(url)
        .catch((resp: Response) => {
          expect(errorTriggered).toBe(false);
          expect(resp.status).toEqual(500);
        });
    });
  });

  describe('When I remove the interceptor', () => {
    let errorTriggered: boolean;

    beforeEach(() => {
      errorTriggered = false;

      fetchStub
        .withArgs(url, { headers: new headersPolyfill() })
        .returns(Promise.resolve(failure(internalServerError)));

      httpErrorInterceptor = new HttpErrorInterceptor(http);
      httpErrorInterceptor.setErrorInterceptor('500', () => errorTriggered = true);

      httpErrorInterceptor.removeInterceptor();
    });

    it('Should not trigger the interceptor', () => {
      return http.get(url)
        .catch((resp: Response) => {
          expect(errorTriggered).toBe(false);
          expect(resp.status).toEqual(500);
        });
    });
  });

  describe('When url is publicapi', () => {
    let errorTriggered: boolean;
    const publicapiRoot = 'publicapi';
    const publicUrl = [url, publicapiRoot].join('/');
    const specifiedError = 500;
    const urlSpecifiedError = [publicUrl, specifiedError].join('/');

    beforeEach(() => {
      errorTriggered = false;

      fetchStub
        .withArgs(urlSpecifiedError, { headers: new headersPolyfill() })
        .returns(Promise.resolve(failure(internalServerError, {
          status: specifiedError,
          url: urlSpecifiedError,
        })));

      httpErrorInterceptor = new HttpErrorInterceptor(http, publicapiRoot);
      httpErrorInterceptor.setErrorInterceptor('500', () => errorTriggered = true);
    });

    it('Should trigger the interceptor even if the error matches as on publicapi', () => {
      return http.get(urlSpecifiedError)
        .catch((resp: Response) => {
          expect(errorTriggered).toBe(false);
          expect(resp.status).toEqual(specifiedError);
        });
    });
  });
});
