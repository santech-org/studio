// tslint:disable-next-line:no-implicit-dependencies
import { analytics, IAnalyticsJS } from '@santech/analytics-core';
import { createJestSpyObj, SantechSpyObject } from '@santech/core/testing';

const analyticsMethods = Object.keys(analytics);

let spyAnalytics: SantechSpyObject<IAnalyticsJS>;

if (typeof jasmine !== 'undefined' && typeof jasmine.createSpyObj === 'function') {
  spyAnalytics = jasmine.createSpyObj('spyAnalytics', analyticsMethods);
} else if (typeof jest !== 'undefined') {
  spyAnalytics = createJestSpyObj(analyticsMethods);
}

export {
  spyAnalytics,
};
