import { IHttpErrorMessagesEnum, IHttpErrorsEnum } from './models';

export const httpErrors: IHttpErrorsEnum = {
  conflict: 'error.conflict',
  unauthorized: 'error.unauthorized',
};

export const httpErrorMessages: IHttpErrorMessagesEnum = {
  conflict: 'error.message.conflict',
  unauthorized: 'error.message.unauthorized',
};
