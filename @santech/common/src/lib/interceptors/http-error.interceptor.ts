import { IDeserializedResponse, IError, IHttpInterceptor } from '@santech/core';

export const unkownHttpError: IError = {
  code: 0,
  error: 'unknown',
};

export const badRequestError: IError = {
  code: 400,
  error: 'error.badRequest',
};

export const unauthorizedError: IError = {
  code: 401,
  error: 'error.unauthorized',
};

export const accessDeniedError: IError = {
  code: 403,
  error: 'error.accessDenied',
};

export const notFoundError: IError = {
  code: 404,
  error: 'error.notFound',
};

export const conflictError: IError = {
  code: 409,
  error: 'error.conflict',
};

export const requestEntityTooLargeError: IError = {
  code: 413,
  error: 'error.requestEntityTooLarge',
};

export const lockedError: IError = {
  code: 423,
  error: 'error.locked',
};

export const upgradeRequiredError: IError = {
  code: 426,
  error: 'error.upgradeRequired',
};

export const internalServerErrorError: IError = {
  code: 500,
  error: 'error.internalServerError',
};

const httpErrors: IError[] = [
  badRequestError,
  accessDeniedError,
  unauthorizedError,
  notFoundError,
  conflictError,
  requestEntityTooLargeError,
  lockedError,
  upgradeRequiredError,
  internalServerErrorError,
];

export class HttpErrorInterceptor implements IHttpInterceptor {
  public response(res: IDeserializedResponse<any>): IDeserializedResponse<IError> {
    if (res.ok) {
      return res;
    }

    const {
      status,
      data: body,
    } = res;

    const errorData = httpErrors
      .find((e) => e.code === status && e.error === body.error) || unkownHttpError;

    res.data = {
      ...errorData,
      body,
    };
    return res;
  }
}
