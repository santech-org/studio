import { InjectionToken } from '@angular/core';
import { IAnalyticsJS } from '@santech/analytics-core';

export const ANALYTICS = new InjectionToken<IAnalyticsJS>('analytics');
