import { IAuthenticatorEndPoints, ILogggerEndPoints } from '@santech/common';
import { IConfigEndPoints } from '../interfaces/end-points';

export function endpointsFactory(endpoints: IConfigEndPoints): IAuthenticatorEndPoints & ILogggerEndPoints {
  const endPoint = endpoints.endPoint.concat('/api');
  const publicEndPoint = endpoints.endPoint.concat('/publicapi');
  return {
    authenticateEndPoint: publicEndPoint.concat('/authenticate'),
    endPoint,
    logEndPoint: endPoint.concat('/logs'),
    publicEndPoint,
    renewEndPoint: endPoint.concat('/renew'),
    wsEndPoint: endpoints.wsEndPoint,
    zuulEndPoint: endpoints.endPoint.concat('/zuul/api'),
  };
}
