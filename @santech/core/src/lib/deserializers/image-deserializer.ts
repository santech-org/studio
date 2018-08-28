import { IHttpDeserializer } from '.';
import { IResponse } from '../models';

export class ImageDeserializer implements IHttpDeserializer<Blob> {
  public deserialize(res: IResponse<any>) {
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.startsWith('image/')) {
      return res.blob();
    }
    return res;
  }
}
