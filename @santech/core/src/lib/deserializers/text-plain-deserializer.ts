import { IHttpDeserializer } from '.';
import { IResponse } from '../models';

export class TextPlainDeserializer implements IHttpDeserializer<string> {
  public deserialize(res: IResponse<any>) {
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('text/plain')) {
      return res.text();
    }
    return res;
  }
}
