import { InjectionToken } from '@angular/core';
import { IAnalyticsResolver } from '../interfaces/track-event';

export const ANALYTICS_RESOLVERS = new InjectionToken<Array<IAnalyticsResolver<any, any>>>('analyticsResolvers');
