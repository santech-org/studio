import { IAuthenticatorEndPoints } from '@santech/common';
import { IConfigEndPoints } from '../interfaces/end-points';

export function endpointsFactory(endpoints: IConfigEndPoints): IAuthenticatorEndPoints {
  const endPoint = endpoints.endPoint.concat('/api');
  const publicEndPoint = endpoints.endPoint.concat('/publicapi');
  return {
    authenticateEndPoint: publicEndPoint.concat('/authenticate'),
    endPoint,
    publicEndPoint,
    renewEndPoint: endPoint.concat('/renew'),
    wsEndPoint: endpoints.wsEndPoint,
    zuulEndPoint: endpoints.endPoint.concat('/zuul/api'),
  };
}
