import { IDeserializedResponse, IRequestConfig } from '../models';

export interface IHttpInterceptor {
  request?: (requestInfo: RequestInfo, config: IRequestConfig) => IRequestConfig | Promise<IRequestConfig>;
  response?: (response: IDeserializedResponse<any>) => IDeserializedResponse<any> | Promise<IDeserializedResponse<any>>;
}
