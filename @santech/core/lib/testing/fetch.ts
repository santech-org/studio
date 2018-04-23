export const conflict = {
  error: 'error.conflict',
  fieldErrors: [],
  message: 'error.message.conflict',
  path: '/publicapi/authenticate',
  timestamp: '2017-11-20T11:34:46.642+0000',
};

export const unauthorized = {
  error: 'error.unauthorized',
  fieldErrors: [],
  message: 'error.message.unauthorized',
  path: '/publicapi/authenticate',
  timestamp: '2017-11-20T11:34:46.642+0000',
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
