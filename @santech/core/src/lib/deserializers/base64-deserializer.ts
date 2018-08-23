import { IHttpDeserializer } from '.';
import { IResponse } from '../models';

export class Base64Deserializer implements IHttpDeserializer<string> {
  public deserialize(res: IResponse<any>) {
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/base64')) {
      return res.text();
    }
    return res;
  }
}
