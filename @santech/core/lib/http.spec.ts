import sinon = require('sinon');
import { Base64Deserializer } from './deserializers/base64-deserializer';
import { ImageDeserializer } from './deserializers/image-deserializer';
import { JsonDeserializer } from './deserializers/json-deserializer';
import { TextPlainDeserializer } from './deserializers/text-plain-deserializer';
import { Http } from './http';
import { FormDataRequestInterceptor } from './interceptors/form-data-request.interceptor';
import { JsonRequestInterceptor } from './interceptors/json-request.interceptor';
import { failure, internalServerError, success } from './testing/fetch';

const client = sinon.stub() as typeof fetch & sinon.SinonStub;

// No typings for fetch-headers...
// tslint:disable-next-line:variable-name no-var-requires
const headers: typeof Headers = require('fetch-headers');

const url = 'http://host:port/path';

describe('Http', () => {
  beforeEach(() => {
    client.reset();
    client.resetBehavior();
  });

  describe('When I call original fetch', () => {
    beforeEach(() => client
      .withArgs(url, { headers: new headers() })
      .returns(Promise.resolve(success({}))));

    it('Should make the call', async () => {
      const res = await new Http({ client, headers })
        .fetch(url);
      expect(await res.json()).toEqual({});
    });
  });

  describe('When I want to GET a json resource', () => {
    const backendData = { foo: 'bar' };
    const deserializers = [
      new JsonDeserializer(),
    ];

    beforeEach(() => client
      .withArgs(url, { headers: new headers() })
      .returns(Promise.resolve(success(backendData))));

    it('Should call wrapped fetch', async () => {
      const res = await new Http({ client, headers, deserializers }).get(url);
      expect(res.data).toEqual(backendData);
    });

    describe('And I need to pass custom headers', () => {
      beforeEach(() => client
        .withArgs(url, { headers: new headers({ foo: 'bar' }) })
        .returns(Promise.resolve(success(backendData))));

      it('Should pass custom headers', async () => {
        const res = await new Http({ client, headers, deserializers })
          .get(url, { headers: { foo: 'bar' } });
        expect(res.data).toEqual(backendData);
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
        client
          .withArgs(url.concat('?baz=quux&baz=42&foo=bar&zip=true'), {
            headers: new headers(),
            params,
          })
          .returns(Promise.resolve(success(backendData)));
      });

      it('Should pass params', async () => {
        const res = await new Http({ client, headers, deserializers }).get(url, { params });
        expect(res.data).toEqual(backendData);
      });

      describe('And parameters require encoding', () => {
        const encodableParam = 'endika+1@mail.com';
        const paramsWithEncodableParam = { encodableParam, ...params };

        beforeEach(() => {
          client
            .withArgs([url,
              '?encodableParam=',
              encodeURIComponent(encodableParam),
              '&baz=quux&baz=42&foo=bar&zip=true',
            ].join(''), {
                headers: new headers(),
                params: paramsWithEncodableParam,
              })
            .returns(Promise.resolve(success(backendData)));
        });

        it('Should encode parameters', async () => {
          const res = await new Http({ client, headers, deserializers }).get(url, { params });
          expect(res.data).toEqual(backendData);
        });
      });
    });
  });

  describe('When I want to POST Json data', () => {
    const frontendData = { foo: 'bar' };
    const backendData = { baz: 'quux' };
    const deserializers = [
      new JsonDeserializer(),
    ];
    const interceptors = [
      new JsonRequestInterceptor(),
    ];

    beforeEach(() => client
      .withArgs(url, {
        body: JSON.stringify(frontendData),
        headers: new headers({
          'content-type': 'application/json',
        }),
        method: 'POST',
      })
      .returns(Promise.resolve(success(backendData))));

    it('Should prepare a default JSON request and call wrapped fetch', async () => {
      const res = await new Http({ client, headers, deserializers, interceptors })
        .post(url, frontendData);
      expect(res.data).toEqual(backendData);
    });
  });

  describe('When I want to PUT Json data', () => {
    const frontendData = { foo: 'bar' };
    const backendData = { baz: 'quux' };
    const deserializers = [
      new JsonDeserializer(),
    ];
    const interceptors = [
      new JsonRequestInterceptor(),
    ];

    beforeEach(() => client
      .withArgs(url, {
        body: JSON.stringify(frontendData),
        headers: new headers([
          ['content-type', 'application/json'],
        ]),
        method: 'PUT',
      })
      .returns(Promise.resolve(success(backendData))));

    it('Should prepare a default JSON request and call wrapped fetch', async () => {
      const res = await new Http({ client, headers, deserializers, interceptors })
        .put(url, frontendData);
      expect(res.data).toEqual(backendData);
    });
  });

  describe('When I want to PATCH Json data', () => {
    const frontendData = { foo: 'bar' };
    const backendData = { baz: 'quux' };
    const deserializers = [
      new JsonDeserializer(),
    ];
    const interceptors = [
      new JsonRequestInterceptor(),
    ];

    beforeEach(() => client
      .withArgs(url, {
        body: JSON.stringify(frontendData),
        headers: new headers([
          ['content-type', 'application/json'],
        ]),
        method: 'PATCH',
      })
      .returns(Promise.resolve(success(backendData))));

    it('Should prepare a default JSON request and call wrapped fetch', async () => {
      const res = await new Http({ client, headers, deserializers, interceptors })
        .patch(url, frontendData);
      expect(res.data).toEqual(backendData);
    });
  });

  describe('When I want to DELETE data', () => {
    beforeEach(() => client
      .withArgs(url, {
        headers: new headers(),
        method: 'DELETE',
      })
      .returns(Promise.resolve(success('', { contentType: 'No Content' }))));

    it('Should prepare a default JSON request and call wrapped fetch', async () => {
      const res = await new Http({ client, headers })
        .delete(url);
      expect(res.ok).toBe(true);
    });
  });

  describe('When I want to POST FormData', () => {
    const frontendData = new Date(); // Date is used here: FormData is not native
    const backendData = { baz: 'quux' };
    const deserializers = [
      new JsonDeserializer(),
    ];
    const interceptors = [
      new JsonRequestInterceptor(),
      new FormDataRequestInterceptor(),
    ];

    beforeEach(() => client
      .withArgs(url, {
        body: frontendData,
        headers: new headers(),
        method: 'POST',
      })
      .returns(Promise.resolve(success(backendData))));

    it('Should not set any header and call wrapped fetch', async () => {
      const res = await new Http({ client, headers, deserializers, interceptors })
        .post(url, frontendData, { headers: { 'Content-Type': 'multipart/form-data' } });
      expect(res.data).toEqual(backendData);
    });
  });

  describe('When I download an image', () => {
    const backendData = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
    const deserializers = [
      new JsonDeserializer(),
      new ImageDeserializer(),
    ];
    const interceptors = [
      new JsonRequestInterceptor(),
      new FormDataRequestInterceptor(),
    ];

    beforeEach(() => client
      .withArgs(url, { headers: new headers() })
      .returns(Promise.resolve(success(backendData, { contentType: 'image/png' }))));

    it('Should return a blob of my image', async () => {
      const res = await new Http({ client, headers, deserializers, interceptors }).get(url);
      expect(res.data).toEqual(backendData);
    });
  });

  describe('When I download a base64 image', () => {
    const backendData = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
    const deserializers = [
      new JsonDeserializer(),
      new ImageDeserializer(),
      new Base64Deserializer(),
    ];
    const interceptors = [
      new JsonRequestInterceptor(),
      new FormDataRequestInterceptor(),
    ];

    beforeEach(() => client
      .withArgs(url, { headers: new headers() })
      .returns(Promise.resolve(success(backendData, { contentType: 'application/base64' }))));

    it('Should return a string of my image', async () => {
      const res = await new Http({ client, headers, deserializers, interceptors }).get(url);
      expect(res.data).toEqual(backendData);
    });
  });

  describe('When I download plain text', () => {
    const backendData = 'plain text';
    const deserializers = [
      new JsonDeserializer(),
      new ImageDeserializer(),
      new Base64Deserializer(),
      new TextPlainDeserializer(),
    ];
    const interceptors = [
      new JsonRequestInterceptor(),
      new FormDataRequestInterceptor(),
    ];

    beforeEach(() => client
      .withArgs(url, { headers: new headers() })
      .returns(Promise.resolve(success(backendData, { contentType: 'text/plain' }))));

    it('Should return my text', async () => {
      const res = await new Http({ client, headers, deserializers, interceptors }).get(url);
      expect(res.data).toEqual(backendData);
    });
  });

  describe('When my request fail', () => {
    const deserializers = [
      new TextPlainDeserializer(),
      new JsonDeserializer(),
      new ImageDeserializer(),
      new Base64Deserializer(),
    ];
    const interceptors = [
      new JsonRequestInterceptor(),
      new FormDataRequestInterceptor(),
    ];

    beforeEach(() => client
      .withArgs(url, { headers: new headers() })
      .returns(Promise.resolve(failure(internalServerError))));

    it('Should throw the response', async () => {
      try {
        await new Http({ client, headers, deserializers, interceptors }).get(url);
        throw new Error('not a response');
      } catch (res) {
        expect(res.ok).toBe(false);
        expect(res.status).toEqual(500);
        expect(res.data).toEqual(internalServerError);
      }
    });
  });

  describe('When I provide an interceptor', () => {
    const headerKey = 'Authorization';
    const http = new Http({ client, headers });
    let remover: () => void;
    let interceptorInfo: RequestInfo;

    beforeEach(() => remover = http
      .addInterceptor({
        request: (requestInfo, config) => new Promise((res) => {
          interceptorInfo = requestInfo;
          config.headers.append(headerKey, 'Bearer Token');
          res(config);
        }),
        response: (res) => {
          return {
            ...res,
            data: { foo: 'bar' },
          };
        },
      }));

    afterEach(() => remover());

    describe('And I perform a request', () => {
      beforeEach(() => client
        .withArgs(url, {
          headers: new headers({
            [headerKey]: 'Bearer Token',
          }),
        })
        .returns(Promise.resolve(success({}))));

      it('Should play request interceptor, make the call and play response interceptor', async () => {
        const res = await http.get(url);
        expect(res.data).toEqual({ foo: 'bar' });
        expect(interceptorInfo).toEqual(url);
      });
    });

    describe('And I remove it', () => {
      beforeEach(() => remover());

      it('Should not throw if called more than once', () => {
        expect(() => remover()).not.toThrow();
      });

      describe('And I perform a request', () => {
        beforeEach(() => client
          .withArgs(url, { headers: new headers() })
          .returns(Promise.resolve(success({}))));

        it('Should call wrapped fetch and my interceptor no more', async () => {
          const res = await http.get(url);
          expect(res.data).toEqual({});
        });
      });
    });

    describe('And the interceptor fails', () => {
      beforeEach(() => remover = http
        .addInterceptor({
          request: () => { throw new Error('LOL'); },
        }));

      describe('And I perform a request', () => {
        it('Should reject my call with the error', async () => {
          try {
            await http.get(url);
            throw new Error('not my Error');
          } catch (e) {
            expect(e.message).toBe('LOL');
          }
        });
      });
    });
  });

  describe('When I provide a response deserializer', () => {
    const fooBar = { foo: 'bar' };
    const http = new Http({ client, headers });
    let remover: () => void;

    beforeEach(() => remover = http
      .addDeserializer({
        deserialize: (response: Response) => {
          const contentType = response.headers.get('Content-Type');
          if (contentType === 'myContentType') {
            return Promise.resolve(fooBar);
          }
          return response;
        },
      }));

    afterEach(() => remover());

    beforeEach(() => client
      .withArgs(url, { headers: new headers() })
      .returns(Promise.resolve(success({}, { contentType: 'myContentType' }))));

    describe('And I perform a request', () => {
      it('Should make the call and deserialize', async () => {
        const res = await http.get(url);
        expect(res.data).toEqual({ foo: 'bar' });
      });
    });

    describe('And I remove it', () => {
      beforeEach(() => remover());

      it('Should not throw if called more than once', () => {
        expect(() => remover()).not.toThrow();
      });

      describe('And I perform a request', () => {
        it('Should call wrapped fetch and my deserializer no more', async () => {
          const res = await http.get(url);
          expect(res.data).toEqual({});
        });
      });
    });

    describe('And the deserializer fails', () => {
      beforeEach(() => client
        .withArgs(url, { headers: new headers() })
        .returns(Promise.resolve(success({}))));

      beforeEach(() => remover = http
        .addDeserializer({
          deserialize: () => { throw new Error('LOL'); },
        }));

      describe('And I perform a request', () => {
        it('Should reject my call with the error', async () => {
          try {
            await http.get(url);
            throw new Error('not my Error');
          } catch (e) {
            expect(e.message).toBe('LOL');
          }
        });
      });
    });
  });

  describe('When interceptors or deserializers instances are added multiple times', () => {
    const interceptor = { request: jest.fn(), response: jest.fn() };
    interceptor.request.mockImplementation((_, c) => c);
    interceptor.response.mockImplementation((r) => r);
    const deserializer = { deserialize: jest.fn() };
    deserializer.deserialize.mockImplementation((r) => r);
    const interceptors = [interceptor, interceptor];
    const deserializers = [deserializer, deserializer];

    beforeEach(() => client
      .withArgs(url, { headers: new headers() })
      .returns(Promise.resolve(success({}))));

    it('Should call them once', async () => {
      await new Http({ client, headers, deserializers, interceptors }).get(url);
      expect(interceptor.request.mock.calls.length).toBe(1);
      expect(interceptor.response.mock.calls.length).toBe(1);
      expect(deserializer.deserialize.mock.calls.length).toBe(1);
    });
  });
});
