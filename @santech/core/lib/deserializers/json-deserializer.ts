import { IHttpDeserializer } from '.';
import { IResponse } from '../models';

export class JsonDeserializer implements IHttpDeserializer<any> {
  public deserialize(res: IResponse<any>) {
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return res.json();
    }
    return res;
  }
}
