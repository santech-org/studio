import { IResponse } from '../models';

export interface IHttpDeserializer<T> {
  deserialize(response: IResponse<any>): Promise<T> | IResponse<any>;
}
