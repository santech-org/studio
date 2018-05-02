import sinon = require('sinon');
import { Http } from './http';
import { failure, internalServerError, success, unauthorized } from './testing/fetch';

const fetchStub = sinon.stub() as typeof fetch & sinon.SinonStub;

// No typings for fetch-headers...
// tslint:disable-next-line:no-var-requires
const headersPolyfill: typeof Headers = require('fetch-headers');

const url = 'http://host:port/path';

describe('Http', () => {
  let http: Http;

  beforeEach(() => {
    fetchStub.reset();
    fetchStub.resetBehavior();
    http = new Http(fetchStub, headersPolyfill);
  });

  describe('When I call original fetch', () => {
    beforeEach(() => fetchStub
      .withArgs(url, { method: 'LOL', headers: new headersPolyfill() })
      .returns(Promise.resolve(success({}))));

    beforeEach(() => http.fetch(url, { method: 'LOL' }));

    it('Should pass the params', () => {
      expect(fetchStub.calledWith(url, { method: 'LOL', headers: new headersPolyfill() })).toBe(true);
    });
  });

  describe('When I want to POST with fetch', () => {
    const frontendData = { foo: 'bar' };
    const backendData = { baz: 'quux' };

    beforeEach(() => fetchStub
      .withArgs(url, {
        body: JSON.stringify(frontendData),
        headers: new headersPolyfill([
          ['Content-Type', 'my/application/json'],
        ]),
        method: 'POST',
      })
      .returns(Promise.resolve(success(backendData))));

    it('Should call wrapped fetch', () => {
      return http.fetch<typeof backendData>(url, {
        body: JSON.stringify(frontendData),
        headers: [
          ['Content-Type', 'my/application/json'],
        ],
        method: 'POST',
      })
        .then((resp) => {
          expect(resp.data).toEqual(backendData);
        });
    });
  });

  describe('When I want to make a basic request', () => {
    const backendData = { foo: 'bar' };

    beforeEach(() => fetchStub
      .withArgs(url, { headers: new headersPolyfill() })
      .returns(Promise.resolve(success(backendData))));

    it('Should call wrapped fetch', () => {
      return http.get<typeof backendData>(url)
        .then((resp) => {
          expect(resp.data).toEqual(backendData);
        });
    });

    describe('And I want to pass custom headers', () => {
      beforeEach(() => fetchStub
        .withArgs(url, { headers: new headersPolyfill([['FOO', 'bar']]) })
        .returns(Promise.resolve(success(backendData))));

      it('Should pass custom headers', () => {
        return http.get<typeof backendData>(url, { headers: [['FOO', 'bar']] })
          .then((resp) => {
            expect(resp.data).toEqual(backendData);
          });
      });
    });

    describe('And I want to pass custom queryString', () => {
      const params: any = {
        baz: ['quux', 42, {}],
        foo: 'bar',
        plop: {},
        zip: true,
      };

      beforeEach(() => {
        fetchStub
          .withArgs(url.concat('?baz=quux&baz=42&foo=bar&zip=true'), {
            headers: new headersPolyfill(),
            params,
          })
          .returns(Promise.resolve(success(backendData)));
      });

      it('Should pass params', () => {
        return http.get<typeof backendData>(url, { params })
          .then((resp) => {
            expect(resp.data).toEqual(backendData);
          });
      });

      describe('When parameters require encoding', () => {
        const encodableParam = 'endika+1@mail.com';
        const paramsWithEncodableParam: any = { encodableParam, ...params };

        beforeEach(() => {
          fetchStub
            .withArgs([url,
              '?encodableParam=',
              encodeURIComponent(encodableParam),
              '&baz=quux&baz=42&foo=bar&zip=true',
            ].join(''), {
              headers: new headersPolyfill(),
              params: paramsWithEncodableParam,
            })
            .returns(Promise.resolve(success(backendData)));
        });

        it('Should encode parameters', () => {
          return http.get<typeof backendData>(url, { params: paramsWithEncodableParam })
            .then((resp) => {
              expect(resp.data).toEqual(backendData);
            });
        });
      });
    });
  });

  describe('When I want to POST data', () => {
    const frontendData = { foo: 'bar' };
    const backendData = { baz: 'quux' };

    beforeEach(() => fetchStub
      .withArgs(url, {
        body: JSON.stringify(frontendData),
        headers: new headersPolyfill([
          ['content-type', 'application/json'],
        ]),
        method: 'POST',
      })
      .returns(Promise.resolve(success(backendData))));

    it('Should prepare a default JSON request and call wrapped fetch', () => {
      return http.post<typeof backendData>(url, frontendData)
        .then((resp) => {
          expect(resp.data).toEqual(backendData);
        });
    });
  });

  describe('When I want to PUT data', () => {
    const frontendData = { foo: 'bar' };
    const backendData = { baz: 'quux' };

    beforeEach(() => fetchStub
      .withArgs(url, {
        body: JSON.stringify(frontendData),
        headers: new headersPolyfill([
          ['content-type', 'application/json'],
        ]),
        method: 'PUT',
      })
      .returns(Promise.resolve(success(backendData))));

    it('Should prepare a default JSON request and call wrapped fetch', () => {
      return http.put<typeof backendData>(url, frontendData)
        .then((resp) => {
          expect(resp.data).toEqual(backendData);
        });
    });
  });

  describe('When I want to PATCH data', () => {
    const frontendData = { foo: 'bar' };
    const backendData = { baz: 'quux' };

    beforeEach(() => fetchStub
      .withArgs(url, {
        body: JSON.stringify(frontendData),
        headers: new headersPolyfill([
          ['content-type', 'application/json'],
        ]),
        method: 'PATCH',
      })
      .returns(Promise.resolve(success(backendData))));

    it('Should prepare a default JSON request and call wrapped fetch', () => {
      return http.patch<typeof backendData>(url, frontendData)
        .then((resp) => {
          expect(resp.data).toEqual(backendData);
        });
    });
  });

  describe('When I want to DELETE data', () => {
    beforeEach(() => fetchStub
      .withArgs(url, {
        headers: new headersPolyfill(),
        method: 'DELETE',
      })
      .returns(Promise.resolve(success('', { contentType: 'No Content' }))));

    it('Should prepare a default JSON request and call wrapped fetch', () => {
      return http.delete(url)
        .then((resp: Response) => {
          expect(resp.ok).toBe(true);
        });
    });
  });

  describe('When I want to POST FormData', () => {
    const frontendData = new Date(); // Date is used here as FormData is not native
    const backendData = { baz: 'quux' };

    beforeEach(() => fetchStub
      .withArgs(url, {
        body: frontendData,
        headers: new headersPolyfill(),
        method: 'POST',
      })
      .returns(Promise.resolve(success(backendData))));

    it('Should not set any header and call wrapped fetch', () => {
      return http.post<typeof backendData>(url, frontendData, {
        headers: [
          ['Content-Type', 'multipart/form-data'],
        ],
      })
        .then((resp) => {
          expect(resp.data).toEqual(backendData);
        });
    });
  });

  describe('When I download an image', () => {
    const backendData = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

    beforeEach(() => fetchStub
      .withArgs(url, { headers: new headersPolyfill() })
      .returns(Promise.resolve(success(backendData, { contentType: 'image/png' }))));

    it('Should return my image as a blob', () => {
      return http.get<typeof backendData>(url)
        .then((resp) => {
          expect(resp.data).toEqual(backendData);
        });
    });
  });

  describe('When I download a base64 image', () => {
    const backendData = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

    beforeEach(() => fetchStub
      .withArgs(url, { headers: new headersPolyfill() })
      .returns(Promise.resolve(success(backendData, { contentType: 'application/base64' }))));

    it('Should return my image as a string', () => {
      return http.get<typeof backendData>(url)
        .then((resp) => {
          expect(resp.data).toEqual(backendData);
        });
    });
  });

  describe('When I download plain text', () => {
    const backendData = 'plain text';

    beforeEach(() => fetchStub
      .withArgs(url, { headers: new headersPolyfill() })
      .returns(Promise.resolve(success(backendData, { contentType: 'text/plain' }))));

    it('Should return my text', () => {
      return http.get<typeof backendData>(url)
        .then((resp) => {
          expect(resp.data).toEqual(backendData);
        });
    });
  });

  describe('When my request fail', () => {
    beforeEach(() => fetchStub
      .withArgs(url, { headers: new headersPolyfill() })
      .returns(Promise.resolve(failure(internalServerError))));

    it('Should call wrapped fetch', () => {
      return http.get(url)
        .catch((resp: Response) => {
          expect(resp.ok).toBe(false);
          expect(resp.status).toEqual(500);
          return resp.json() as Promise<typeof internalServerError>;
        })
        .then((error) => {
          expect(error).toEqual(internalServerError);
        });
    });
  });

  describe('When I provide a request interceptor', () => {
    const headerKey = 'Authorization';
    let remover: () => void;
    let requestUrl: string;

    beforeEach(() => remover = http
      .addRequestInterceptor((interceptorUrl, config) =>
        new Promise((res) => {
          requestUrl = interceptorUrl;
          const headers = config.headers = http.createHeaders(config.headers);
          headers.append(headerKey, 'Bearer Token');
          res(config);
        })));

    describe('And I perform a request', () => {
      beforeEach(() => fetchStub
        .withArgs(url, {
          headers: new headersPolyfill([
            [headerKey, 'Bearer Token'],
          ]),
        })
        .returns(Promise.resolve(success({}))));

      it('Should call interceptor and wrapped fetch', () => {
        return http.fetch(url)
          .then((resp) => {
            expect(resp.data).toEqual({});
            expect(requestUrl).toEqual(url);
          });
      });
    });

    describe('And I remove it', () => {
      beforeEach(() => remover());

      it('Should not throw if called more than once', () => {
        expect((http as any)._requestInterceptors.length).toEqual(2);
        remover();
        expect((http as any)._requestInterceptors.length).toEqual(2);
      });

      describe('And I perform a request', () => {
        beforeEach(() => fetchStub
          .withArgs(url, { headers: new headersPolyfill() })
          .returns(Promise.resolve(success({}))));

        it('Should call wrapped fetch and my interceptor no more', () => {
          http.fetch(url)
            .then((resp) => {
              expect(resp.data).toEqual({});
            });
        });
      });
    });

    describe('And it fails', () => {
      beforeEach(() => remover = http
        .addRequestInterceptor(() => { throw new Error('LOL'); }));

      describe('And I perform a request', () => {
        it('Should reject my call with the error', () => {
          http.fetch(url)
            .catch((err: Error) => {
              expect(err.message).toEqual('LOL');
            });
        });
      });
    });
  });

  describe('When I provide a response interceptor', () => {
    let remover: () => void;

    beforeEach(() => remover = http
      .addResponseInterceptor((response: Response) => {
        if (response.status === 403) {
          throw new Error('Not authorized');
        }
      }));

    beforeEach(() => fetchStub
      .withArgs(url, { headers: new headersPolyfill() })
      .returns(Promise.resolve(failure(unauthorized, {
        status: 403,
      }))));

    describe('And I perform a request', () => {
      it('Should call interceptor and wrapped fetch', () => {
        return http.fetch(url)
          .catch((err: Error) => {
            expect(err.message).toEqual('Not authorized');
          });
      });
    });

    describe('And I remove it', () => {
      beforeEach(() => remover());

      it('Should not throw if called more than once', () => {
        expect((http as any)._responseInterceptors.length).toEqual(0);
        remover();
        expect((http as any)._responseInterceptors.length).toEqual(0);
      });

      describe('And I perform a request', () => {
        it('Should call wrapped fetch and my interceptor no more', () => {
          return http.fetch(url)
            .catch((resp: Response) => {
              expect(resp.ok).toBe(false);
              expect(resp.status).toEqual(403);
              return resp.json() as Promise<typeof unauthorized>;
            })
            .then((error) => {
              expect(error).toEqual(unauthorized);
            });
        });
      });
    });
  });

  describe('When I provide a response deserializer', () => {
    const fooBar: any = { foo: 'bar' };
    let remover: () => void;

    beforeEach(() => remover = http
      .addResponseDeserializer((response: Response) => {
        const contentType = response.headers.get('Content-Type');
        if (contentType === 'myContentType') {
          return Promise.resolve(fooBar);
        }
        return response;
      }));

    beforeEach(() => fetchStub
      .withArgs(url, { headers: new headersPolyfill() })
      .returns(Promise.resolve(success({}, { contentType: 'myContentType' }))));

    describe('And I perform a request', () => {
      it('Should wrapped fetch and deserializer', () => {
        http.fetch(url)
          .then((resp) => {
            expect(resp.data).toEqual({ foo: 'bar' });
          });
      });
    });

    describe('And I remove it', () => {
      beforeEach(() => remover());

      it('Should not throw if called more than once', () => {
        expect((http as any)._responseDeserializers.length).toEqual(4);
        remover();
        expect((http as any)._responseDeserializers.length).toEqual(4);
      });

      describe('And I perform a request', () => {
        it('Should call wrapped fetch and my deserializer no more', () => {
          http.fetch(url)
            .then((resp: Response) => resp.json())
            .then((data) => {
              expect(data).toEqual({});
            });
        });
      });
    });
  });
});
