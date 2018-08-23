export const badRequest = {
  error: 'error.badRequest',
  fieldErrors: [],
  message: 'Path variable is not consistent with given dto',
  path: '/api/profiles/ed55e435-7973-4d1e-bc9d-1622cfb947e9',
  timestamp: '2018-05-18T11:41:25.517+0000',
};

export const unauthorized = {
  error: 'error.unauthorized',
  fieldErrors: [],
  message: 'error.message.unauthorized',
  path: '/publicapi/authenticate',
  timestamp: '2017-11-20T11:34:46.642+0000',
};

export const accessDenied = {
  error: 'error.accessDenied',
  message: 'error.accessDenied',
  path: '/api/profiles/forOwner/66e46f45-43f8-4f75-a311-61be64d8eb93',
  timestamp: '2018-05-18T11:43:29.653+0000',
};

export const notFound = {
  error: 'error.notFound',
  fieldErrors: [],
  message: 'error.message.noDataFound',
  path: '/api/profiles/ed55e435-7973-4d1e-bc9d-1622cfb947e9',
  timestamp: '2018-05-18T11:38:58.330+0000',
};

export const conflict = {
  error: 'error.conflict',
  fieldErrors: [],
  message: 'error.message.conflict',
  path: '/publicapi/authenticate',
  timestamp: '2017-11-20T11:34:46.642+0000',
};

export const locked = {
  error: 'error.locked',
  fieldErrors: [],
  path: '/api/enrollment/valid',
  timestamp: '2018-05-21T11:47:57.112+0000',
};

export const internalServerError = {
  error: 'error.internalServerError',
  fieldErrors: [],
  message: 'Internal server error',
  path: '/publicapi/authenticate',
  timestamp: '2017-11-20T11:34:46.642+0000',
};

export interface ISuccessParams {
  status?: number;
  url?: string;
  contentType?: string;
}

export const success = <T>(response: T, params: ISuccessParams = {}) => {
  params = params || {};
  return {
    blob: (): Promise<T> => Promise.resolve(response),
    data: response,
    headers: {
      get: () => params.contentType || 'application/json',
    },
    json: (): Promise<T> => Promise.resolve(response),
    ok: true,
    status: params.status || 200,
    text: (): Promise<T> => Promise.resolve(response),
  };
};

export interface IFailureParams {
  status?: number;
  url?: string;
  contentType?: string;
}

export const failure = <T>(error: T, params: IFailureParams = {}) => {
  return {
    blob: (): Promise<T> => Promise.resolve(error),
    data: error,
    headers: {
      get: () => params.contentType || 'application/json',
    },
    json: (): Promise<T> => Promise.resolve(error),
    ok: false,
    status: params.status || 500,
    text: (): Promise<T> => Promise.resolve(error),
    url: params.url,
  };
};
